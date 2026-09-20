import type { Reference } from '@portfolio/data/domain/types';
import type { useTranslations } from '@/i18n/compat';
import type { BreadcrumbItem } from '../../navigation/breadcrumbs';
import type { DetailEntry } from './types';
import { joinDefined } from './join-defined';
import { pushEntry } from './push-entry';
import { formatDate } from './format-date';
import { stateLabel } from './state-label';
import { typeSpecificEntries } from './type-specific-entries';

type AchadoDetailViewDataOptions = {
  item: Reference;
  locale: string;
  t: ReturnType<typeof useTranslations>;
  tFields: ReturnType<typeof useTranslations>;
  tNav: ReturnType<typeof useTranslations>;
};

export function getAchadoDetailViewData(props: AchadoDetailViewDataOptions) {
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

  const breadcrumbTrail: BreadcrumbItem[] = [
    { label: props.tNav('achados'), href: '/findings' },
    { label: props.item.title },
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
