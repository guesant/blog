import { initAnalyticsConsent } from './analytics-consent.js';

// Mirrors App\Support\ViewMode::paramFor() so the query param derived here
// always matches the one the server used for the initial render.
function viewParamFor(denseTarget) {
  const prefix = 'view-dense-';
  if (!denseTarget.startsWith(prefix)) return 'view';
  return 'view_' + denseTarget.slice(prefix.length).replace(/-/g, '_');
}

// A page can have more than one dense/spacious pair (e.g. projects has a
// main list and a separate experiments list), so each toggle group carries
// its own target ids instead of the handler assuming a single fixed pair.
document.querySelectorAll('.view-toggle[data-dense-target]').forEach(function (group) {
  const denseList = document.getElementById(group.dataset.denseTarget);
  const spaciousList = document.getElementById(group.dataset.spaciousTarget);
  if (!denseList || !spaciousList) return;

  const param = viewParamFor(group.dataset.denseTarget);

  group.querySelectorAll('.view-toggle-btn[data-view]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const mode = btn.dataset.view;
      denseList.hidden = mode !== 'dense';
      spaciousList.hidden = mode !== 'spacious';
      group.querySelectorAll('.view-toggle-btn[data-view]').forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });

      const url = new URL(window.location.href);
      if (mode === 'dense') {
        url.searchParams.set(param, 'dense');
      } else {
        url.searchParams.delete(param);
      }
      history.replaceState(history.state, '', url);
    });
  });
});

initAnalyticsConsent();
