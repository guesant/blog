import { createElement } from 'react';
import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator, FieldsTranslator, NavTranslator } from '@/i18n/compat-support';
import type { BreadcrumbItem } from '../../navigation/breadcrumbs';
import type { DetailEntry } from './types';
import { joinDefined } from './join-defined';
import { pushEntry } from './push-entry';
import { formatDate } from '../../content/format-date';
import { stateLabel } from './state-label';
import { typeSpecificEntries } from './type-specific-entries';
import { Icon } from '../../primitives/icon';
import { findingVisualTitle } from '@/i18n/finding-visual-title';
import { getFindingTypeLabel } from '../../content/content-feed/get-finding-type-label';

type FindingDetailViewDataOptions = {
  item: Reference;
  locale: string;
  t: AchadosTranslator;
  tFields: FieldsTranslator;
  tNav: NavTranslator;
};

export function getFindingDetailViewData(props: FindingDetailViewDataOptions) {
  const formattedPublishedDate = props.item.publishedDateISO
    ? new Intl.DateTimeFormat(props.locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        timeZone: 'UTC',
      }).format(new Date(props.item.publishedDateISO))
    : undefined;

  const details = typeSpecificEntries(props.item, props.tFields);

  const authors = joinDefined([props.item.authors, props.item.organizations]);

  const typeLabel = getFindingTypeLabel({ findingType: props.item.type, t: props.t });

  const title = findingVisualTitle({ title: props.item.title, typeLabel });

  const breadcrumbTrail: BreadcrumbItem[] = [
    { label: props.tNav('achados'), href: '/findings' },
    { label: title, leadingIcon: createElement(Icon, { name: 'search', size: 15 }) },
  ];

  const cycleEntries: DetailEntry[] = [];

  if (props.item.foundDateISO) {
    pushEntry(cycleEntries, props.t('foundOn'), formatDate(props.item.foundDateISO, props.locale));
  }

  if (props.item.consumptionState) {
    pushEntry(cycleEntries, props.t('state'), stateLabel(props.item.consumptionState, props.t));
  }

  return { authors, breadcrumbTrail, cycleEntries, details, formattedPublishedDate };
}
