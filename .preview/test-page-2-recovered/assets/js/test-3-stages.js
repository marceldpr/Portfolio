const walkthrough = new URL('../img/copilot_01.webp', import.meta.url).href;
const stillWalkthrough = new URL('../img/test-3/creation-walkthrough.png', import.meta.url).href;
const configuration = new URL('../img/copilot_03.webp', import.meta.url).href;

const stages = [
  {
    label: '01 Describe',
    title: 'Describe the intent.',
    text: 'The initial description supplied the creator’s intent. The experience could infer details already present in that description, apply reasonable defaults, and leave specialized settings for later.',
    image: walkthrough,
    alt: 'Copilot agent creation walkthrough, showing the description and configuration experience.',
    height: 1003,
    animated: true,
  },
  {
    label: '02 Try',
    title: 'Try an initial agent.',
    text: 'In Configure, I shifted the experience from finish configuring, then try to create, try, then refine.',
    image: walkthrough,
    alt: 'The same Copilot agent creation walkthrough, illustrating the experience used to create and try an agent.',
    height: 1003,
    animated: true,
  },
  {
    label: '03 Refine',
    title: 'Refine when it matters.',
    text: 'Advanced control remained available in Configure: creators could inspect and edit identity, instructions, knowledge sources, starter prompts, and supported capabilities.',
    image: configuration,
    alt: 'Copilot Configure view with an agent’s purpose, general guidelines, and capabilities including connected knowledge sources.',
    height: 1451,
    animated: false,
  },
];

let instanceCount = 0;

export function initCreationStages() {
  document.querySelectorAll('div[data-creation-stages]').forEach((root) => {
    if (root.dataset.t3StagesInitialized) return;
    root.dataset.t3StagesInitialized = 'true';
    root.classList.add('t3-stages-root');
    const prefix = `t3-stages-${++instanceCount}`;

    root.innerHTML = `
      <div class="t3-stages-tabs" role="tablist" aria-label="Agent creation stages">
        ${stages.map((stage, index) => `
          <button class="t3-stages-tab" type="button" role="tab"
            id="${prefix}-tab-${index}" aria-controls="${prefix}-panel-${index}"
            aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">
            ${stage.label}
          </button>
        `).join('')}
      </div>
      ${stages.map((stage, index) => `
        <div class="t3-stages-panel" role="tabpanel" tabindex="0"
          id="${prefix}-panel-${index}" aria-labelledby="${prefix}-tab-${index}"
          ${index === 0 ? '' : 'hidden'}>
          <div class="t3-stages-copy">
            <h3 class="t3-stages-heading">${stage.title}</h3>
            <p class="t3-stages-description">${stage.text}</p>
          </div>
          <picture class="t3-stages-media">
            ${stage.animated ? `<source media="(prefers-reduced-motion: reduce)" srcset="${stillWalkthrough}">` : ''}
            <img class="t3-stages-image" src="${stage.image}" alt="${stage.alt}"
              width="1600" height="${stage.height}" loading="lazy" decoding="async">
          </picture>
        </div>
      `).join('')}
    `;

    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));

    function selectStage(selectedIndex) {
      tabs.forEach((tab, index) => {
        const selected = index === selectedIndex;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[index].hidden = !selected;
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectStage(index));
      tab.addEventListener('keydown', (event) => {
        let nextIndex;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        selectStage(nextIndex);
        tabs[nextIndex].focus();
      });
    });
  });
}
