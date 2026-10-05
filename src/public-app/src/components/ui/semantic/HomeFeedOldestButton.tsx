import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { HomeFeedPaginationButton } from './HomeFeedPaginationButton';

export const HomeFeedOldestButton = createSemanticSxComponent<
  ComponentProps<typeof HomeFeedPaginationButton>
>(HomeFeedPaginationButton, { justifyContent: 'flex-end', justifySelf: 'end' });
