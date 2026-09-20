import { Box } from '../../ui';
import type { DetailArticleProps } from './types';

export function DetailArticle(props: DetailArticleProps) {
  return (
    <Box component="article" visualVariant="detailArticle">
      {props.children}
    </Box>
  );
}
