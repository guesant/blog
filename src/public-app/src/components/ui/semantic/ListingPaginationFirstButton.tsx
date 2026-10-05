import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { ListingPaginationButton } from './ListingPaginationButton';

export const ListingPaginationFirstButton = createSemanticSxComponent<
  ComponentProps<typeof ListingPaginationButton>
>(ListingPaginationButton, { justifySelf: 'start' });
