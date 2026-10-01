import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { ToggleButtonGroup as BaseComponent } from '@/components/ui/toggle-button-group';

export const ContentFeedDisplayModeToggleGroup = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  flex: '1 1 100%',
  minWidth: 0,
  width: '100%',
  '& .MuiToggleButton-root': {
    flex: '1 1 0',
    minWidth: 0,
    gap: 'var(--site-gap-inline)',
  },
});
