import type { Reference } from '../domain/types.ts';
import { RecordValue } from './public-site-source-support';
import { objectValue } from './public-site-source-object-value';
import { stringValue } from './public-site-source-string-value';

export function referenceTypeDetails(item: RecordValue): Partial<Reference> {
  const type = stringValue(item.type);

  const details = objectValue(item.type_details) ?? objectValue(item[type]);

  if (!details) {
    return {
      book: objectValue(item.book),
      paper: objectValue(item.paper),
      repo: objectValue(item.repo),
      video: objectValue(item.video),
      film: objectValue(item.film),
    };
  }

  const detailKey = {
    book: 'book',
    paper: 'paper',
    repo: 'repo',
    video: 'video',
    playlist: 'video',
    channel: 'video',
    film: 'film',
  }[type] as 'book' | 'paper' | 'repo' | 'video' | 'film' | undefined;

  return detailKey ? { [detailKey]: details } : {};
}
