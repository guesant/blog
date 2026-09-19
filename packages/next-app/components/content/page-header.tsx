import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getEditableProps } from '@portfolio/content/editing';
import type { PageIntroduction } from '@portfolio/content/types';
import { type BreadcrumbItem, Breadcrumbs } from '../navigation/breadcrumbs';
import { Icon } from '../primitives/icon';
import { NavButton } from '../primitives/nav-button';

type EditableProps = Record<string, string | undefined>;

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  editableProps?: { eyebrow?: EditableProps; title?: EditableProps; description?: EditableProps };
  breadcrumbs?: BreadcrumbItem[];
};

type EditablePageHeaderProps = {
  page: PageIntroduction;
  source: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
};

export function PageHeader(props: PageHeaderProps) {
  const { eyebrow, title, description, editableProps, breadcrumbs } = props;
  return (
    <Box component="header" sx={{ maxWidth: '46rem', mb: { xs: 7, md: 9 } }}>
      {breadcrumbs && <Breadcrumbs trail={breadcrumbs} />}
      <Typography
        variant="overline"
        color="text.secondary"
        {...editableProps?.eyebrow}
        sx={{ display: 'block', mb: 1.5 }}
      >
        {eyebrow}
      </Typography>
      <Typography
        variant="h1"
        {...editableProps?.title}
        sx={{ fontSize: 'var(--site-text-3xl)', maxWidth: '20ch' }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          color="text.secondary"
          {...editableProps?.description}
          sx={{ maxWidth: '60ch', mt: 2, fontSize: '1rem' }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}

export function EditablePageHeader(props: EditablePageHeaderProps) {
  const { page, source, breadcrumbs } = props;
  return (
    <PageHeader
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      breadcrumbs={breadcrumbs}
      editableProps={{
        eyebrow: getEditableProps(source, 'eyebrow'),
        title: getEditableProps(source, 'title'),
        description: getEditableProps(source, 'description'),
      }}
    />
  );
}

type DetailHeaderProps = {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  description?: string;
  meta?: string;
  editableProps?: {
    eyebrow?: EditableProps;
    title?: EditableProps;
    description?: EditableProps;
    meta?: EditableProps;
  };
  breadcrumbs?: BreadcrumbItem[];
};

export function DetailHeader(props: DetailHeaderProps) {
  const { backHref, backLabel, eyebrow, title, description, meta, editableProps, breadcrumbs } =
    props;
  return (
    <Box component="header" sx={{ maxWidth: '52rem' }}>
      {breadcrumbs && <Breadcrumbs trail={breadcrumbs} />}
      <NavButton
        href={backHref}
        startIcon={<Icon name="arrow-left" size={15} />}
        sx={{ px: 1, py: 0.5, ml: -1, mb: 5 }}
      >
        {backLabel}
      </NavButton>
      <Typography
        variant="overline"
        color="text.secondary"
        {...editableProps?.eyebrow}
        sx={{ display: 'block' }}
      >
        {eyebrow}
      </Typography>
      <Typography
        variant="h1"
        {...editableProps?.title}
        sx={{ mt: 1.5, fontSize: 'var(--site-text-3xl)', maxWidth: '20ch' }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          {...editableProps?.description}
          sx={{ mt: 2.5, maxWidth: '62ch', fontSize: '1.0625rem', lineHeight: 1.65 }}
        >
          {description}
        </Typography>
      )}
      {meta && (
        <Typography
          color="text.secondary"
          {...editableProps?.meta}
          sx={{ mt: 2, fontSize: '.8125rem' }}
        >
          {meta}
        </Typography>
      )}
    </Box>
  );
}
