document.querySelectorAll('[data-dropdown]').forEach((root) => {
  const trigger = root.querySelector('[data-dropdown-trigger]');
  const menu = root.querySelector('[data-dropdown-menu]');
  if (!trigger || !menu) return;

  const items = () => Array.from(menu.querySelectorAll('[data-dropdown-item]'));
  const isOpen = () => !menu.hidden;

  function openMenu() {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    items()[0]?.focus();
  }

  function closeMenu({ refocusTrigger = false } = {}) {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (refocusTrigger) trigger.focus();
  }

  trigger.addEventListener('click', () => {
    isOpen() ? closeMenu() : openMenu();
  });

  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu();
    }
  });

  menu.addEventListener('keydown', (event) => {
    const list = items();
    const currentIndex = list.indexOf(document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      list[(currentIndex + 1) % list.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      list[(currentIndex - 1 + list.length) % list.length]?.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ refocusTrigger: true });
    } else if (event.key === 'Tab') {
      closeMenu();
    }
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('[data-dropdown-item]')) {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (isOpen() && !root.contains(event.target)) {
      closeMenu();
    }
  });
});
