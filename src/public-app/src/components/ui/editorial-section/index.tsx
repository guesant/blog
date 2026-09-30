import type { ReactNode } from 'react';
import { Box } from '../box';
import { Divider } from '../divider';
import { Typography } from '../typography';
import { ConditionalContent } from '../../primitives/conditional-content';
import { editorialDescriptionStyles, editorialSectionTitleStyles } from '../editorial-typography';

export type EditorialSectionProps = {
  id?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  divider?: boolean;
  sectionGap?: string;
};

const sectionStyles = {
  display: 'grid',
  rowGap: 'var(--site-space-6)',
  textAlign: 'left',
};

const headerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: 'var(--site-space-2)',
  textAlign: 'left',
};

const descriptionStyles = {
  ...editorialDescriptionStyles,
  display: 'block',
};

export function EditorialSection(props: EditorialSectionProps) {
  return (
    <Box
      component="section"
      id={props.id}
      sx={[
        sectionStyles,
        {
          ...(props.sectionGap ? { rowGap: props.sectionGap } : {}),
        },
      ]}
    >
      <ConditionalContent
        condition={Boolean(props.divider)}
        content={<Divider sx={{ width: '100%', borderColor: 'var(--site-border)' }} />}
      />
      <Box component="header" sx={headerStyles}>
        <Typography component="h2" variant="h2" sx={editorialSectionTitleStyles}>
          {props.title}
        </Typography>
        <ConditionalContent
          condition={Boolean(props.description)}
          content={
            <Typography color="text.secondary" sx={descriptionStyles}>
              {props.description}
            </Typography>
          }
        />
      </Box>
      <Box sx={{ width: '100%', minWidth: 0 }}>{props.children}</Box>
      {props.footer}
    </Box>
  );
}
