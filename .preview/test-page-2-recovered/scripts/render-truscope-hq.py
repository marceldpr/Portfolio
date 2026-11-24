"""Render the three replacement recordings with a registered HQ blueprint.

Run from the project root with the OpenCV environment. The original assets
and previous preview remain untouched. Camera/scroll timestamps stay stable.
"""
import json
from pathlib import Path
import subprocess

import cv2
import numpy as np

WIDTH, HEIGHT, FPS, FRAMES = 1920, 1248, 30, 749
ROOT = Path('assets')
registration = {name: np.vstack([value, [0, 0, 1]]) for name, value in
                json.loads(Path('scripts/truscope-hq-registration.json').read_text()).items()}
blueprint = cv2.imread(str(ROOT / 'img/case-format/markup-blueprint-hq.jpg'))
if blueprint is None:
    raise RuntimeError('Could not read the supplied blueprint')
# Registration was measured against the same drawing embedded at 4096 × 2926.
height, width = blueprint.shape[:2]
registration = {name: matrix @ np.diag([4096 / width, 2926 / height, 1])
                for name, matrix in registration.items()}


def smooth(value):
    value = float(np.clip(value, 0, 1))
    return value * value * (3 - 2 * value)


def camera(scale, point):
    return np.array([[scale, 0, WIDTH / 2 - point[0] * scale],
                     [0, scale, HEIGHT / 2 - point[1] * scale], [0, 0, 1]])


def picture(image, matrix):
    return cv2.warpAffine(image, matrix[:2], (WIDTH, HEIGHT),
                          flags=cv2.INTER_CUBIC, borderValue=(255, 255, 255))


class Recording:
    def __init__(self, name, base):
        self.name, self.base = name, base
        self.capture = cv2.VideoCapture(str(ROOT / f'video/markup-{name}-source-v2.mp4'))
        self.index = -1
        self.frame = None
        self.fps = self.capture.get(cv2.CAP_PROP_FPS)

    def at(self, time):
        index = round(time * self.fps)
        if index < self.index:
            self.capture.set(cv2.CAP_PROP_POS_FRAMES, index)
            self.index = index - 1
        while self.index < index:
            ok, frame = self.capture.read()
            if not ok:
                raise RuntimeError(f'Unexpected end of {self.name} at {time}')
            self.index += 1
            self.frame = frame
        return self.frame


fit = WIDTH * .94 / 1776
desktop = Recording('desktop', camera(fit, (888, 540)))
ipad = Recording('ipad', np.array([[.982, 0, 267], [0, .982, 150], [0, 0, 1.]]))
iphone = Recording('iphone', camera(1.05, (260, 540)))
# Exact center of the selected desktop markup in the shared blueprint space.
focus = (np.linalg.inv(registration['desktop']) @ [975.375, 623.98, 1])[:2]
endpoint = camera(1.7 * 4096 / width, focus)
blueprint_mask = np.ones(blueprint.shape[:2], np.float32)
camera_frames = []


def zoom(recording, frame, progress, erase_menu=False):
    base = recording.base
    end = endpoint @ np.linalg.inv(registration[recording.name])
    start_scale = base[0, 0]
    end_scale = np.sqrt(np.linalg.det(end[:2, :2]))
    scale = start_scale * (end_scale / start_scale) ** progress
    start_focus = (np.linalg.inv(base) @ [WIDTH / 2, HEIGHT / 2, 1])[:2]
    end_focus = (registration[recording.name] @ [*focus, 1])[:2]
    point = start_focus + (end_focus - start_focus) * progress
    shape = np.eye(2) + (end[:2, :2] / end_scale - np.eye(2)) * smooth((progress - .4) / .6)
    matrix = np.eye(3)
    matrix[:2, :2] = scale * shape
    matrix[:2, 2] = [WIDTH / 2, HEIGHT / 2] - matrix[:2, :2] @ point
    if erase_menu:
        frame = frame.copy()
        frame[93:961, 204:432] = 248
    result = picture(frame, matrix)
    # Use the full-resolution drawing before the recorded pixels become large.
    # Both surfaces share one camera, so no separate crop can drift into view.
    blend = smooth((scale / start_scale - 1.15) / .85)
    if blend:
        drawing_camera = matrix @ registration[recording.name]
        detail = picture(blueprint, drawing_camera)
        mask = cv2.warpAffine(blueprint_mask, drawing_camera[:2], (WIDTH, HEIGHT),
                              flags=cv2.INTER_LINEAR, borderValue=0)
        alpha = (mask * blend)[:, :, None]
        result = np.rint(result * (1 - alpha) + detail * alpha).astype(np.uint8)
    return result, matrix


def encoder(path):
    return subprocess.Popen([
        'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-f', 'rawvideo',
        '-pix_fmt', 'bgr24', '-s', f'{WIDTH}x{HEIGHT}', '-r', str(FPS), '-i', '-',
        '-an', '-vf', 'scale=in_range=full:out_range=full:out_color_matrix=bt709',
        '-color_range', 'pc', '-colorspace', 'bt709', '-color_primaries', 'bt709',
        '-color_trc', 'bt709', '-c:v', 'libx264', '-preset', 'fast', '-crf', '15',
        '-g', '6', '-keyint_min', '6', '-sc_threshold', '0', '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart', str(path),
    ], stdin=subprocess.PIPE)


def render():
    main = encoder(ROOT / 'video/truscope-cross-device-hq.mp4')
    fallback = encoder(ROOT / 'video/truscope-cross-device-hq-playback.mp4')
    try:
        for index in range(FRAMES):
            time = index / FPS
            alternative = None
            if time <= 9:
                # Preserve the immediate drawer reveal at the selected click.
                source_time = float(np.interp(min(time, 3.6), [0, 1.167, 3.6], [0, 2.15, 5.25]))
                source = desktop.at(source_time)
                progress = smooth((time - 6.3) / 2.7)
                erase = 6.6 <= time <= 9
                frame, matrix = zoom(desktop, source, progress, erase)
                if 6.6 <= time <= 7.5:
                    alternative, _ = zoom(desktop, source, progress)
                if index == 0 or 6.3 <= time <= 7.5:
                    camera_frames.append([round(time, 6), float(matrix[0, 0]), float(matrix[0, 2]), float(matrix[1, 2])])
            elif time < 12.5:
                frame, _ = zoom(ipad, ipad.at(0), 1 - smooth((time - 9) / 3.5))
            elif time <= 18.7:
                source_time = float(np.interp(min(time, 14), [12.5, 13.95, 14], [0, 1.08, 1.3]))
                frame, _ = zoom(ipad, ipad.at(source_time), smooth((time - 16.2) / 2.5))
            elif time < 21:
                frame, _ = zoom(iphone, iphone.at(0), 1 - smooth((time - 18.7) / 2.3))
            else:
                source_time = float(np.interp(min(time, 21.8), [21, 21.75, 21.8], [0, 1.5, 1.65]))
                frame = picture(iphone.at(source_time), iphone.base)
            main.stdin.write(frame.tobytes())
            fallback.stdin.write((alternative if alternative is not None else frame).tobytes())
            if index == 0:
                cv2.imwrite(str(ROOT / 'img/case-format/truscope-hq-poster.jpg'), frame)
                cv2.imwrite(str(ROOT / 'img/case-format/markup-menu-match-hq.png'), source[93:961, 204:432])
            if index % 150 == 0:
                print(f'Rendered {index}/{FRAMES}', flush=True)
    finally:
        main.stdin.close()
        fallback.stdin.close()
        for recording in [desktop, ipad, iphone]:
            recording.capture.release()
    statuses = [main.wait(), fallback.wait()]
    if any(statuses):
        raise RuntimeError(f'Encoder failure: {statuses}')
    Path('assets/js/test-2-desktop-camera.js').write_text(
        '// Generated by scripts/render-truscope-hq.py.\nexport const desktopCameraFrames = '
        + json.dumps(camera_frames) + ';\n')
    print('Finished both HQ videos', flush=True)


if __name__ == '__main__':
    render()
