'use client';

import { useTranslations } from '@/i18n/compat';
import { groupByLabel, type ConnectionsSectionProps } from './types';
import { ConnectionGroup } from './connection-group';
import { ConnectionsSection2Frame } from '../../ui/semantic/ConnectionsSection2Frame';
import { ConnectionsSectionFrame } from '../../ui/semantic/ConnectionsSectionFrame';
import { ConnectionsSectionText } from '../../ui/semantic/ConnectionsSectionText';

export function ConnectionsSection(props: ConnectionsSectionProps) {
  const { relations } = props;

  const t = useTranslations('Pages.achados');

  if (relations.length === 0) {
    return null;
  }

  return (
    <ConnectionsSectionFrame component="section">
      <ConnectionsSectionText component="h2">{t('connectionsHeading')}</ConnectionsSectionText>
      <ConnectionsSection2Frame>
        {[...groupByLabel(relations)].map(([label, items]) => (
          <ConnectionGroup key={label} label={label} items={items} />
        ))}
      </ConnectionsSection2Frame>
    </ConnectionsSectionFrame>
  );
}
