import type { ExternalProfile } from '@portfolio/data/domain/types';

export type ContactProfileGridProps = {
  profiles: ExternalProfile[];
  tExternalProfiles: (key: string) => string;
};
