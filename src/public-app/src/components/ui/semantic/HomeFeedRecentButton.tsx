import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { HomeFeedPaginationButton } from './HomeFeedPaginationButton';

export const HomeFeedRecentButton = createSemanticSxComponent<
  ComponentProps<typeof HomeFeedPaginationButton>
>(HomeFeedPaginationButton, { justifyContent: 'flex-start', justifySelf: 'start' });
