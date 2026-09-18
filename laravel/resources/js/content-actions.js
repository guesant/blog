import { copyToClipboardWithLabelFeedback } from './shared/copy-to-clipboard.js';

document.querySelectorAll('[data-content-actions]').forEach((root) => {
  const title = root.dataset.contentActionsTitle || document.title;
  const url = root.dataset.contentActionsUrl || window.location.href;
  const filename = root.dataset.contentActionsFilename || 'content';
  const markdown =
    root.querySelector('[data-content-actions-markdown]')?.content?.textContent ?? '';
  const text = root.querySelector('[data-content-actions-text]')?.content?.textContent ?? '';

  function downloadBlob(content, type, extension) {
    const blob = new Blob([content], { type });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  }

  root.querySelectorAll('[data-content-actions-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.contentActionsAction;

      if (action === 'share') {
        const label = button.querySelector('[data-content-actions-share-label]');
        if (navigator.share) {
          navigator.share({ title, url }).catch(() => {});
          return;
        }
        navigator.clipboard
          .writeText(url)
          .then(() => {
            if (!label) return;
            clearTimeout(button._shareTimeout);
            label.textContent = label.dataset.sharedLabel;
            button._shareTimeout = setTimeout(() => {
              label.textContent = label.dataset.shareLabel;
            }, 2000);
          })
          .catch(() => {});
        return;
      }

      if (action === 'copy-text' || action === 'copy-markdown') {
        const label = button.querySelector(
          action === 'copy-text'
            ? '[data-content-actions-copy-text-label]'
            : '[data-content-actions-copy-markdown-label]',
        );
        const content = action === 'copy-text' ? text : markdown;
        copyToClipboardWithLabelFeedback(content, button, label);
        return;
      }

      if (action === 'download-txt') {
        downloadBlob(text, 'text/plain', 'txt');
        return;
      }

      if (action === 'download-md') {
        downloadBlob(markdown, 'text/markdown', 'md');
      }
    });
  });
});
