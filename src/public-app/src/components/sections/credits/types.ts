import type {
  CreditsPageContent as CreditsContent,
  PackageCredit,
} from '@portfolio/data/domain/types';
import type { ReactNode } from 'react';

export type CreditsSectionProps = { heading: string; maxWidth?: string; children: ReactNode };

export type EntryListProps = { entries: CreditsContent['credits']['entries'] };

export type CreditEntry = CreditsContent['credits']['entries'][number];

export type PackageListProps = { packages: PackageCredit[] };

export type CreditsPageContentProps = { content: CreditsContent };
