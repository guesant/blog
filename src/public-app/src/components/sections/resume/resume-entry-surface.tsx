import type { ReactNode } from 'react';
import { Box } from '../../ui';
import { EntryDescription } from './entry-description';
import { ResumeEntryHeading } from './resume-entry-heading';

type ResumeEntrySurfaceProps<Item extends { name: string; period: string }> = {
  item: Item;
  description?: string;
  children: ReactNode;
};

export function ResumeEntrySurface<Item extends { name: string; period: string }>(
  props: ResumeEntrySurfaceProps<Item>,
) {
  return (
    <Box>
      <ResumeEntryHeading item={props.item}>{props.children}</ResumeEntryHeading>
      <EntryDescription description={props.description} />
    </Box>
  );
}
