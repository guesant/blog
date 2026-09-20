export function copyToClipboardWithLabelFeedback(text, button, label) {
  return navigator.clipboard
    .writeText(text)
    .then(() => {
      if (!label) return;
      clearTimeout(button._copyTimeout);
      label.textContent = label.dataset.copiedLabel;
      button._copyTimeout = setTimeout(() => {
        label.textContent = label.dataset.label;
      }, 2000);
    })
    .catch(() => {});
}
