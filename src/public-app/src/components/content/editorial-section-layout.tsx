import type { ReactNode } from 'react';
import { Divider, Box, Typography } from '../ui';
import { ConditionalContent } from '../primitives/conditional-content';

type EditorialSectionLayoutProps = {
  id?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  divider?: boolean;
  titleVisualVariant?: string;
  descriptionVisualVariant?: string;
};

export function EditorialSectionLayout(props: EditorialSectionLayoutProps) {
  return (
    <Box component="section" id={props.id} visualVariant="sectionShell">
      {props.divider && <Divider visualVariant="sectionShell" />}
      <Box component="header" visualVariant="sectionShellHeader">
        <Typography component="h2" variant="h2" visualVariant={props.titleVisualVariant}>
          {props.title}
        </Typography>
        <ConditionalContent
          condition={Boolean(props.description)}
          content={
            <Typography color="text.secondary" visualVariant={props.descriptionVisualVariant}>
              {props.description}
            </Typography>
          }
        />
      </Box>
      <Box visualVariant="sectionShellBody">{props.children}</Box>
      <ConditionalContent condition={Boolean(props.footer)} content={props.footer} />
    </Box>
  );
}
