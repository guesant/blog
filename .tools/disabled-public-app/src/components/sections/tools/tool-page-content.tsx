'use client';

import { PasswordGenerator } from './password-generator';
import { RandomStringGenerator } from './random-string-generator';
import { LegacyToolWorkbench } from './legacy-tool-workbench';

type ToolPageContentProps = { slug: string };

export function ToolPageContent(props: ToolPageContentProps) {
  const { slug } = props;

  if (slug === 'password-generator') return <PasswordGenerator />;
  if (slug === 'random-string-generator') return <RandomStringGenerator />;
  return <LegacyToolWorkbench slug={slug} />;
}
