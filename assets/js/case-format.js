const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const asset = (name) => `/assets/img/case-format/${name}`;

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

document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const track = gallery.querySelector('[data-track]');
  const slides = [...track.children];
  const controls = [...gallery.querySelectorAll('[data-slide]')];
  const fills = controls.map((control) => control.querySelector('.carousel-progress'));
  const playback = gallery.querySelector('[data-playback]');
  const dock = gallery.querySelector('.carousel-dock');
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
    playback.setAttribute('aria-label', `${ended ? 'Replay' : playing ? 'Pause' : 'Play'} highlights`);
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

const views = [
  { image: 'b4841.png', alt: 'The redesigned For You homepage' },
  { image: '2332e.png', alt: 'TruScope 3D BIM viewer on iPhone' },
  { image: 'f1e34.png', alt: 'TruScope sheet management on iPhone' },
];
document.querySelectorAll('[data-viewer]').forEach((viewer) => {
  const image = viewer.querySelector('[data-viewer-image]');
  const controls = [...viewer.querySelectorAll('[data-view]')];
  controls.forEach((control, index) => control.addEventListener('click', () => {
    image.src = asset(views[index].image);
    image.alt = views[index].alt;
    controls.forEach((button, buttonIndex) => button.setAttribute('aria-current', String(buttonIndex === index)));
  }));
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
