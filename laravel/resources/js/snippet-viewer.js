import { copyToClipboardWithLabelFeedback } from './shared/copy-to-clipboard.js';

document.querySelectorAll('[data-snippet-viewer]').forEach((root) => {
  const treeButtons = Array.from(root.querySelectorAll('[data-file-id]'));
  const panels = Array.from(root.querySelectorAll('[data-file-panel]'));
  const hint = root.querySelector('[data-snippet-file-hint]');

  function activate(fileId) {
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.fileId !== fileId;
    });
    treeButtons.forEach((button) => {
      const isActive = button.dataset.fileId === fileId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
    if (hint) hint.hidden = true;
  }

  treeButtons.forEach((button) => {
    button.addEventListener('click', () => activate(button.dataset.fileId));
  });

  if (panels.length > 0) {
    activate(panels[0].dataset.fileId);
  }

  root.querySelectorAll('[data-file-copy]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('[data-file-panel]');
      const code = panel?.querySelector('code')?.textContent ?? '';
      const label = button.querySelector('[data-copy-label]');
      copyToClipboardWithLabelFeedback(code, button, label);
    });
  });

  root.querySelectorAll('[data-file-download]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('[data-file-panel]');
      const code = panel?.querySelector('code')?.textContent ?? '';
      const filename = panel?.dataset.filename ?? 'file.txt';
      const blob = new Blob([code], { type: 'text/plain' });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    });
  });
});
