import type { Components } from 'react-markdown';
import { MarkdownImage } from './markdown-image';
import { MarkdownLink } from './markdown-link';

export const markdownComponents: Components = {
  a: MarkdownLink,
  img: MarkdownImage,
};
