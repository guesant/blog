import type { DetailArticleProps } from './types';
import { DetailArticleFrame } from '../../ui/semantic/DetailArticleFrame';

export function DetailArticle(props: DetailArticleProps) {
  return <DetailArticleFrame component="article">{props.children}</DetailArticleFrame>;
}
