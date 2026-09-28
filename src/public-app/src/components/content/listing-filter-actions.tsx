'use client';

import { Icon } from '../primitives/icon';
import { ConditionalContent } from '../primitives/conditional-content';
import { ActionIconButton } from '../ui/semantic/ActionIconButton';
import { ListingFilterActionsFrame } from '../ui/semantic/ListingFilterActionsFrame';

type ListingFilterActionsProps = {
  applyLabel: string;
  clearLabel?: string;
  onClear?: () => void;
  showClear?: boolean;
};

export function ListingFilterActions(props: ListingFilterActionsProps) {
  return (
    <ListingFilterActionsFrame>
      <ActionIconButton
        type="submit"
        data-action="apply"

        size="small"
        aria-label={props.applyLabel}
        title={props.applyLabel}
      >
        <Icon name="search" size={15} />
      </ActionIconButton>
      <ConditionalContent
        condition={Boolean(props.showClear !== false && props.onClear && props.clearLabel)}
        content={
          <ActionIconButton
            type="button"
            onClick={props.onClear}
            data-action="clear"

            size="small"
            aria-label={props.clearLabel}
            title={props.clearLabel}
          >
            <Icon name="trash" size={15} />
          </ActionIconButton>
        }
      />
    </ListingFilterActionsFrame>
  );
}
