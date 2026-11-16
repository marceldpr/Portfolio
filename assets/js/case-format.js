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
  let active = 0;
  let scheduled = false;
  const moveTo = (index) => {
    const padding = parseFloat(getComputedStyle(track).paddingLeft);
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft - padding, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  const update = () => {
    const start = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft);
    active = slides.reduce((nearest, slide, index) => Math.abs(slide.getBoundingClientRect().left - start) < Math.abs(slides[nearest].getBoundingClientRect().left - start) ? index : nearest, 0);
    controls.forEach((control, index) => control.setAttribute('aria-current', String(index === active)));
    scheduled = false;
  };
  controls.forEach((control, index) => control.addEventListener('click', () => moveTo(index)));
  track.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  track.addEventListener('keydown', (event) => {
    const destinations = { ArrowRight: Math.min(active + 1, slides.length - 1), ArrowLeft: Math.max(active - 1, 0), Home: 0, End: slides.length - 1 };
    if (event.key in destinations) { event.preventDefault(); moveTo(destinations[event.key]); }
  });
  window.addEventListener('resize', update, { passive: true });
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
document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
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
