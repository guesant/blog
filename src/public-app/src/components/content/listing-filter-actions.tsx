'use client';

import { Box, Button } from '../ui';
import { Icon } from '../primitives/icon';
import { ConditionalContent } from '../primitives/conditional-content';

type ListingFilterActionsProps = {
  applyLabel: string;
  clearLabel?: string;
  onClear?: () => void;
  showClear?: boolean;
};

export function ListingFilterActions(props: ListingFilterActionsProps) {
  return (
    <Box visualVariant="listingFilterActions">
      <Button
        type="submit"
        data-action="apply"
        siteVariant="action-icon"
        size="small"
        aria-label={props.applyLabel}
        title={props.applyLabel}
      >
        <Icon name="search" size={15} />
      </Button>
      <ConditionalContent
        condition={Boolean(props.showClear !== false && props.onClear && props.clearLabel)}
        content={
          <Button
            type="button"
            onClick={props.onClear}
            data-action="clear"
            siteVariant="action-icon"
            size="small"
            aria-label={props.clearLabel}
            title={props.clearLabel}
          >
            <Icon name="trash" size={15} />
          </Button>
        }
      />
    </Box>
  );
}
