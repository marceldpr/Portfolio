const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const asset = (name) => `/assets/img/case-format/${name}`;

// Scrub the supplied reveal in both directions while its stage stays in view.
// A static final frame remains available without scripting, motion, or codec support.
document.querySelectorAll('[data-scroll-reveal]').forEach((scene) => {
  const video = scene.querySelector('[data-scroll-video]');
  const stage = scene.querySelector('.ar-scroll-stage');
  let failed = !video.canPlayType('video/webm');
  let target = 0;
  let frame = 0;

  const seek = () => {
    if (scene.dataset.enabled !== 'true' || video.readyState < 2 || video.seeking) return;
    if (Math.abs(video.currentTime - target) > 1 / 60) video.currentTime = target;
  };
  const update = () => {
    frame = 0;
    if (scene.dataset.enabled !== 'true' || !Number.isFinite(video.duration)) return;
    const distance = scene.offsetHeight - stage.offsetHeight;
    const start = parseFloat(getComputedStyle(stage).top);
    const progress = Math.max(0, Math.min(1, (start - scene.getBoundingClientRect().top) / distance));
    target = progress * Math.max(0, video.duration - 1 / 30);
    seek();
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const configure = () => {
    video.pause();
    scene.dataset.enabled = String(!failed && !reducedMotion.matches);
    schedule();
  };
  video.addEventListener('loadeddata', schedule);
  video.addEventListener('durationchange', schedule);
  video.addEventListener('seeked', seek);
  const fallback = () => { failed = true; configure(); };
  video.addEventListener('error', fallback);
  video.querySelector('source').addEventListener('error', fallback);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', configure);
  configure();
});

// Match the camera-section parallax: the left phone and details travel together,
// while the right phone drifts in the opposite direction. Scroll reverses the motion.
document.querySelectorAll('[data-phone-parallax]').forEach((scene) => {
  let animations = [];
  let frame = 0;
  const update = () => {
    frame = 0;
    const bounds = scene.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
    animations.forEach((animation) => { animation.currentTime = progress * 1000; });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const configure = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
    if (reducedMotion.matches) return;
    const mobile = matchMedia('(max-width: 734px)').matches;
    const travel = mobile ? 48 : 300 * Math.min(1, scene.clientWidth / 965);
    const tracks = [
      [scene.querySelector('.product-sheets'), travel, -travel],
      [scene.querySelector('.product-ar'), -travel / 10, travel / 10],
    ];
    if (!mobile) tracks.push([scene.querySelector('.principles'), travel, -travel]);
    animations = tracks.map(([element, from, to]) => {
      const animation = element.animate([
        { transform: `translateY(${from}px)` },
        { transform: `translateY(${to}px)` },
      ], { duration: 1000, fill: 'both', easing: 'linear' });
      animation.pause();
      return animation;
    });
    update();
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', configure, { passive: true });
  window.addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', configure);
  configure();
});

// Content stays visible if scripting or IntersectionObserver is unavailable.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('is-pending');
      observer.observe(element);
    }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      document.querySelectorAll('.is-pending').forEach((element) => element.classList.remove('is-pending'));
      observer.disconnect();
    }
  });
}

// Reveal the product text inside the reading area, and re-arm it after the
// reader scrolls back above the group. Keep child motion separate from parallax.
if ('IntersectionObserver' in window) {
  const groups = [...document.querySelectorAll('.stagger-reveal')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= .15) entry.target.classList.remove('is-pending');
      else if (entry.boundingClientRect.top >= innerHeight * .82) entry.target.classList.add('is-pending');
    });
  }, { rootMargin: '0px 0px -18% 0px', threshold: .15 });
  const configure = () => {
    observer.disconnect();
    groups.forEach((group) => {
      group.classList.toggle('is-pending', !reducedMotion.matches);
      if (!reducedMotion.matches) observer.observe(group);
    });
  };
  reducedMotion.addEventListener('change', configure);
  configure();
}

document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const track = gallery.querySelector('[data-track]');
  const slides = [...track.children];
  const controls = [...gallery.querySelectorAll('[data-slide]')];
  const fills = controls.map((control) => control.querySelector('.carousel-progress'));
  const playback = gallery.querySelector('[data-playback]');
  const dock = gallery.querySelector('.carousel-dock');
  const name = gallery.dataset.carouselName || 'highlights';
  // Apple's static-card fallback; final videos can specify their own duration.
  const duration = (index) => Number(slides[index].dataset.duration || 6250);
  let active = 0;
  let elapsed = 0;
  let playing = !reducedMotion.matches;
  let ended = false;
  let inView = false;
  let frame = 0;
  let lastTime = 0;
  let settling = 0;
  let destination = null;

  const render = () => {
    controls.forEach((control, index) => {
      control.setAttribute('aria-selected', String(index === active));
      control.tabIndex = index === active ? 0 : -1;
      fills[index].style.transform = `scaleX(${index === active ? elapsed / duration(active) : 0})`;
    });
    const state = ended ? 'ended' : playing ? 'playing' : 'paused';
    playback.dataset.state = state;
    playback.setAttribute('aria-label', `${ended ? 'Replay' : playing ? 'Pause' : 'Play'} ${name}`);
  };
  const syncClock = () => {
    cancelAnimationFrame(frame);
    lastTime = 0;
    render();
    if (playing && inView && !document.hidden) frame = requestAnimationFrame(tick);
  };
  const pause = () => { playing = false; syncClock(); };
  const select = (index, manual = false) => {
    if (manual) playing = false;
    if (index !== active || ended) elapsed = 0;
    active = index;
    ended = false;
    destination = index;
    const padding = parseFloat(getComputedStyle(track).paddingLeft);
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft - padding, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    // A no-op scroll does not fire scrollend.
    clearTimeout(settling);
    settling = setTimeout(settle, 700);
    syncClock();
  };
  function tick(now) {
    if (lastTime && destination === null) elapsed = Math.min(duration(active), elapsed + now - lastTime);
    lastTime = now;
    fills[active].style.transform = `scaleX(${elapsed / duration(active)})`;
    if (elapsed >= duration(active)) {
      if (active < slides.length - 1) { select(active + 1); return; }
      playing = false;
      ended = true;
      syncClock();
      return;
    }
    frame = requestAnimationFrame(tick);
  }
  function settle() {
    clearTimeout(settling);
    const start = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft);
    const nearest = slides.reduce((best, slide, index) => Math.abs(slide.getBoundingClientRect().left - start) < Math.abs(slides[best].getBoundingClientRect().left - start) ? index : best, 0);
    if (nearest !== active) { active = nearest; elapsed = 0; ended = false; }
    destination = null;
    render();
  }
  const interrupt = () => { destination = null; pause(); };
  controls.forEach((control, index) => {
    control.addEventListener('click', () => { if (index !== active) select(index, true); });
    control.addEventListener('keydown', (event) => {
      const targets = { ArrowRight: (index + 1) % slides.length, ArrowLeft: (index - 1 + slides.length) % slides.length, Home: 0, End: slides.length - 1 };
      if (event.key in targets) { event.preventDefault(); controls[targets[event.key]].focus(); select(targets[event.key], true); }
    });
  });
  playback.addEventListener('click', () => {
    if (ended) { playing = true; select(0); }
    else { playing = !playing; syncClock(); }
  });
  track.addEventListener('pointerdown', interrupt, { passive: true });
  track.addEventListener('wheel', (event) => { if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) interrupt(); }, { passive: true });
  track.addEventListener('scroll', () => { clearTimeout(settling); settling = setTimeout(settle, 150); }, { passive: true });
  track.addEventListener('scrollend', settle);
  track.addEventListener('keydown', (event) => {
    const targets = { ArrowRight: Math.min(active + 1, slides.length - 1), ArrowLeft: Math.max(active - 1, 0), Home: 0, End: slides.length - 1 };
    if (event.key in targets) { event.preventDefault(); select(targets[event.key], true); }
  });
  gallery.addEventListener('focusin', (event) => { if (event.target !== playback) pause(); });
  document.addEventListener('visibilitychange', syncClock);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) pause(); });
  window.addEventListener('resize', () => select(active), { passive: true });
  if ('IntersectionObserver' in window) {
    dock.dataset.ready = 'false';
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .35;
      dock.dataset.ready = String(inView);
      syncClock();
    }, { threshold: [0, .35] }).observe(track);
  } else { inView = true; }
  syncClock();
});

// Tabs use automatic activation with arrow keys, Home and End.
document.querySelectorAll('[data-tabs] [role="tablist"]').forEach((tablist) => {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => {
        item.setAttribute('aria-selected', String(item === tab));
        item.tabIndex = item === tab ? 0 : -1;
      });
      document.getElementById(tab.getAttribute('aria-controls')).setAttribute('aria-labelledby', tab.id);
    });
    tab.addEventListener('keydown', (event) => {
      const destinations = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 };
      if (event.key in destinations) {
        event.preventDefault();
        const next = tabs[destinations[event.key]];
        next.focus();
        next.click();
      }
    });
  });
});

document.querySelectorAll('[data-home]').forEach((tab) => tab.addEventListener('click', () => {
  const image = document.querySelector('[data-home-image]');
  const isBim = tab.dataset.home === 'bim';
  image.src = asset(isBim ? '2332e.png' : 'b4841.png');
  image.alt = isBim ? 'TruScope 3D BIM experience and shared navigation' : 'For You homepage with deadlines, assigned work, and project navigation';
  // The numbered notes describe the homepage, so keep them with that view only.
  document.querySelector('.annotations').hidden = isBim;
  document.querySelector('.annotated-panel .panel-title').textContent = isBim ? '3D BIM viewer' : 'Homepage';
}));

const workflows = {
  upload: { image: '957d8.png', alt: 'Guided sheet upload on a laptop', title: 'Simplifying sheet uploads', description: "One of the competitor's most praised features was its drawing upload wizard. I saw an opportunity to build on this familiar pattern while reducing the manual work involved." },
  issue: { image: 'c618b.png', alt: 'AI-assisted creation of structured tasks from project documents', title: 'Turning project requirements into work', description: 'Project manuals could also be turned into structured tasks for review and assignment.' },
};
document.querySelectorAll('[data-ai]').forEach((tab) => tab.addEventListener('click', () => {
  const workflow = workflows[tab.dataset.ai];
  const image = document.querySelector('[data-ai-image]');
  image.src = asset(workflow.image);
  image.alt = workflow.alt;
  document.querySelector('[data-ai-title]').textContent = workflow.title;
  document.querySelector('[data-ai-description]').textContent = workflow.description;
}));
