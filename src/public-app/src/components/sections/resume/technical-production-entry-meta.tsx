import { ResumeTechnicalProductionMeta } from '../../ui';
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
        <ResumeTechnicalProductionMeta>
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
        </ResumeTechnicalProductionMeta>
      }
    />
  );
}
