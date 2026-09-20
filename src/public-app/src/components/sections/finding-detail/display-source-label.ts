import { hostFromUrl } from './host-from-url';

export function displaySourceLabel(url: string, platform?: string): string | undefined {
  const normalizedPlatform = platform?.trim().toLocaleLowerCase();

  const labels: Record<string, string> = {
    github: 'GitHub',
    gitlab: 'GitLab',
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
  };

  return [
    normalizedPlatform ? labels[normalizedPlatform] : undefined,
    platform?.trim(),
    hostFromUrl(url),
  ].find(Boolean);
}
