const clamp = (value) => Math.max(0, Math.min(1, value));
const SVG_NS = 'http://www.w3.org/2000/svg';
const entities = ['Drawings', 'Issues', 'Tasks', 'Inspections', 'Media', 'RFI'];
const connections = [[0, 1], [0, 3], [1, 2], [1, 4], [2, 3], [2, 5], [3, 4], [4, 5]];

function svgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
  return element;
}

function createGraph(container) {
  const svg = svgElement('svg', { class: 't2-context-graph', 'aria-hidden': 'true', focusable: 'false' });
  const paths = connections.map(() => {
    const path = svgElement('path', { class: 't2-context-graph-edge' });
    const flow = svgElement('path', { class: 't2-context-graph-flow', pathLength: '100' });
    svg.append(path, flow);
    return { path, flow };
  });
  const nodes = entities.map((label) => {
    const node = svgElement('g', { class: 't2-context-graph-node' });
    const circle = svgElement('circle', { r: '4' });
    const text = svgElement('text', { y: '24', 'text-anchor': 'middle' });
    text.textContent = label;
    node.append(circle, text);
    svg.append(node);
    return node;
  });
  container.append(svg);
  return { svg, paths, nodes };
}

/** Reference-inspired pixel reveal and flowing project-context diagram. */
export function initDecorativeMotion() {
  const band = document.querySelector('.t2-ai-principles');
  const art = band?.querySelector('.t2-ai-grid-art');
  const principles = band?.querySelector('.t2-ai-principle-grid');
  if (!band || !art || !principles || band.dataset.decorativeMotion) return;
  band.dataset.decorativeMotion = 'ready';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 't2-pixel-reveal';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!context) return;
  band.append(canvas);
  const graph = createGraph(art);
  let visible = false;
  let frame = 0;
  let lastTime = 0;
  let graphTime = 0;
  let lastGraphPaint = 0;
  let width = 1;
  let height = 1;
  let graphWidth = 1;
  let gridBounds = { top: 0, height: 1 };
  let dirty = true;
  let reveal = 1;
  let outline = 1;
  let pointer = { x: 0, y: 0 };
  let pointerTarget = { x: 0, y: 0 };
  let cells = [];
  let measured = false;

  function measure() {
    const rect = band.getBoundingClientRect();
    const gridRect = principles.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    graphWidth = art.clientWidth;
    gridBounds = { top: gridRect.top - rect.top, height: gridRect.height };
    if (!measured) {
      const start = innerHeight * .5 + 270;
      reveal = reducedMotion.matches ? 1 : clamp((start - rect.top) / start);
      outline = reducedMotion.matches ? 1 : clamp((innerHeight - 120 - gridRect.top) / Math.max(1, innerHeight - 120));
      measured = true;
    }
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.ceil(width * ratio);
    canvas.height = Math.ceil(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    graph.svg.setAttribute('viewBox', `0 0 ${graphWidth} 170`);
    const columns = width <= 767 ? 20 : 60;
    const rows = width <= 767 ? 16 : 20;
    cells = Array.from({ length: columns * rows }, (_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const seed = Math.sin((index + 1) * 127.1) * 43758.5453;
      const priority = row * 50 + (seed - Math.floor(seed)) * 300 + Math.sin(column * .3) * 30;
      return { row, column, columns, rows, delay: clamp(priority / ((rows - 1) * 50 + 330)) * 1.5 };
    });
    dirty = true;
    requestTick();
  }

  function paintPixels() {
    context.clearRect(0, 0, width, height);
    if (reducedMotion.matches) return;
    cells.forEach(({ row, column, columns, rows, delay }) => {
      const cellWidth = width / columns;
      const cellHeight = height / rows;
      const alpha = 1 - clamp((reveal * 1.6 - delay) / .1);
      if (alpha > .001) {
        context.fillStyle = `rgba(0,0,0,${alpha})`;
        context.fillRect(column * cellWidth, row * cellHeight, cellWidth + .5, cellHeight + .5);
      }
      const gridAlpha = (1 - clamp((outline * 1.6 - delay) / .1)) * .2;
      if (gridAlpha > .001) {
        const gridHeight = gridBounds.height / rows;
        context.strokeStyle = `rgba(242,242,242,${gridAlpha})`;
        context.lineWidth = .5;
        context.strokeRect(column * cellWidth, gridBounds.top + row * gridHeight, cellWidth, gridHeight);
      }
      // The faint white pulse overlaps its own exit, like the reference's agents band.
      const pulse = clamp((outline * 2.08 - delay) / .1) - clamp((outline * 2.08 - delay - .48) / .1);
      if (pulse > .001) {
        context.fillStyle = `rgba(255,255,255,${pulse * .05 * (1 - row / rows)})`;
        context.fillRect(column * cellWidth, gridBounds.top + row * gridBounds.height / rows, cellWidth, gridBounds.height / rows);
      }
    });
    dirty = false;
  }

  function paintGraph(time) {
    const mobile = graphWidth <= 767;
    const moving = !reducedMotion.matches;
    const positions = entities.map((_, index) => {
      const x = mobile ? graphWidth * (.18 + (index % 3) * .32) : graphWidth * (.13 + index * .148);
      const y = mobile ? 38 + Math.floor(index / 3) * 76 : 60 + Math.sin(index * 1.6) * 28;
      const phase = time * .00045 + index * 1.3;
      return {
        x: x + (moving ? Math.sin(phase) * 5 + pointer.x * (index % 2 ? 7 : -5) : 0),
        y: y + (moving ? Math.cos(phase * .8) * 4 + pointer.y * 5 : 0),
      };
    });
    graph.nodes.forEach((node, index) => {
      const point = positions[index];
      node.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
    });
    connections.forEach(([from, to], index) => {
      const start = positions[from], end = positions[to];
      const bend = (index % 2 ? 1 : -1) * (mobile ? 25 : 40);
      const path = `M${start.x},${start.y} C${start.x + (end.x - start.x) * .33},${start.y + bend} ${start.x + (end.x - start.x) * .67},${end.y - bend} ${end.x},${end.y}`;
      graph.paths[index].path.setAttribute('d', path);
      graph.paths[index].flow.setAttribute('d', path);
      graph.paths[index].flow.setAttribute('stroke-dashoffset', String(moving ? -(time / 90 + index * 13) % 100 : 0));
    });
  }

  function tick(now) {
    frame = 0;
    const elapsed = lastTime ? Math.min(now - lastTime, 50) : 16;
    lastTime = now;
    const rect = band.getBoundingClientRect();
    const start = innerHeight * .5 + 270;
    const targetReveal = reducedMotion.matches ? 1 : clamp((start - rect.top) / start);
    const targetOutline = reducedMotion.matches ? 1 : clamp((innerHeight - 120 - rect.top - gridBounds.top) / Math.max(1, innerHeight - 120));
    const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-elapsed / 100);
    const nextReveal = reveal + (targetReveal - reveal) * blend;
    const nextOutline = outline + (targetOutline - outline) * blend;
    if (Math.abs(nextReveal - reveal) > .0001 || Math.abs(nextOutline - outline) > .0001) dirty = true;
    reveal = nextReveal;
    outline = nextOutline;
    if (dirty) paintPixels();
    pointer.x += (pointerTarget.x - pointer.x) * .08;
    pointer.y += (pointerTarget.y - pointer.y) * .08;
    if (!reducedMotion.matches && visible && !document.hidden) graphTime += elapsed;
    if (now - lastGraphPaint > 32 || reducedMotion.matches) {
      paintGraph(graphTime);
      lastGraphPaint = now;
    }
    if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(tick);
  }

  function requestTick() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (reducedMotion.matches) {
      reveal = outline = 1;
      dirty = true;
      pointer = pointerTarget = { x: 0, y: 0 };
      paintPixels();
      paintGraph(0);
    }
    if (visible && !document.hidden) requestTick();
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }, { rootMargin: '120px 0px' }).observe(band);
  new ResizeObserver(measure).observe(band);
  band.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    const rect = band.getBoundingClientRect();
    pointerTarget = { x: clamp((event.clientX - rect.left) / rect.width) * 2 - 1, y: clamp((event.clientY - rect.top) / rect.height) * 2 - 1 };
  }, { passive: true });
  band.addEventListener('pointerleave', () => { pointerTarget = { x: 0, y: 0 }; });
  window.addEventListener('scroll', () => { if (visible) requestTick(); }, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', syncPlayback);
  measure();
  paintGraph(0);
}
