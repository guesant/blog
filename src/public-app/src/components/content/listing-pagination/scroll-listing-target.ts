export function scrollListingTarget(scrollTargetId?: string) {
  const target = scrollTargetId ? document.getElementById(scrollTargetId) : undefined;

  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}
