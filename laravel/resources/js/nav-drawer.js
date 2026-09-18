const toggle = document.querySelector('[data-nav-toggle]');
const panel = document.querySelector('[data-nav-panel]');
const backdrop = document.querySelector('[data-nav-backdrop]');

if (toggle && panel && backdrop) {
  function isOpen() {
    return panel.classList.contains('is-open');
  }

  function open() {
    panel.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function close({ refocusToggle = false } = {}) {
    panel.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (refocusToggle) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    isOpen() ? close() : open();
  });

  backdrop.addEventListener('click', () => close());

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => close());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) close({ refocusToggle: true });
  });
}
