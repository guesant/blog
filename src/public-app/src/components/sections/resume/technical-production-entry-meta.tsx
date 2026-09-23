import { Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ExternalLink } from '../../primitives/external-link';
import type { TechnicalProductionItem } from './types';

type TechnicalProductionEntryMetaProps = {
  item: TechnicalProductionItem;
};

export function TechnicalProductionEntryMeta(props: TechnicalProductionEntryMetaProps) {
  return (
    <ConditionalContent
      condition={Boolean(props.item.kind)}
      content={
        <Typography
          variant="body2"
          color="text.secondary"
          visualVariant="technicalProductionEntries"
        >
          {props.item.kind}
          <ConditionalContent
            condition={Boolean(props.item.projectHref?.trim())}
            content={
              <ExternalLink
                href={props.item.projectHref ?? ''}
                children={` · ${props.item.projectHref ?? ''}`}
              />
            }
          />
        </Typography>
      }
    />
  );
}
