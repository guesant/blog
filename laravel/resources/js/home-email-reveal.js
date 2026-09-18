import ProtectedEmailWorker from './protected-email-worker.js?worker';

function createProtectedEmailWorker() {
  // IMPORTANT: dev-only fallback, chosen via import.meta.env.DEV rather
  // than try/catch around `new ProtectedEmailWorker()`. Vite's ?worker
  // wrapper hardcodes the dev-server origin (:5173) into new Worker(),
  // which is cross-origin from the app origin (:8000) — Chromium throws
  // synchronously on that, but Firefox does not (a cross-origin worker
  // script failure there only surfaces later as an async `error` event),
  // so a try/catch around the constructor silently misses the fallback in
  // Firefox and the broken worker's onerror fires instead. Checking DEV
  // directly makes the fallback deterministic across browsers. A blob
  // worker inherits the page origin and may import the dev module
  // cross-origin (Vite serves it with CORS). The URL is assembled
  // dynamically so Vite's build-time static analysis ignores it — in
  // production import.meta.env.DEV is false and this path never runs.
  if (import.meta.env.DEV) {
    const devWorkerUrl = new URL(
      './protected-email-worker.js' + '?worker_file&type=module',
      import.meta.url,
    );
    const blob = new Blob([`import ${JSON.stringify(devWorkerUrl.href)};`], {
      type: 'text/javascript',
    });
    return new Worker(URL.createObjectURL(blob), { type: 'module' });
  }

  return new ProtectedEmailWorker();
}

document.querySelectorAll('[data-protected-email]').forEach((root) => {
  const challenge = JSON.parse(root.dataset.protectedEmail);
  const trigger = root.querySelector('[data-protected-email-trigger]');
  const revealed = root.querySelector('[data-protected-email-revealed]');
  const revealedText = root.querySelector('[data-protected-email-revealed-text]');
  const retryButton = root.querySelector('[data-protected-email-retry]');
  const panels = root.querySelectorAll('[data-protected-email-state]');

  if (!trigger) return;

  function setState(state) {
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.protectedEmailState !== state;
    });
    trigger.hidden = state !== 'idle';
  }

  function reveal() {
    setState('working');

    let worker;
    try {
      worker = createProtectedEmailWorker();
    } catch {
      setState('error');
      return;
    }

    worker.onmessage = (event) => {
      worker.terminate();
      if (event.data.ok) {
        revealed.href = `mailto:${event.data.email}`;
        revealedText.textContent = event.data.email;
        setState('revealed');
      } else {
        setState('error');
      }
    };

    worker.onerror = () => {
      worker.terminate();
      setState('error');
    };

    worker.postMessage(challenge);
  }

  trigger.addEventListener('click', reveal);
  retryButton?.addEventListener('click', reveal);
});
