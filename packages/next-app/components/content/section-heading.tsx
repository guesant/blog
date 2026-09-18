import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icon } from '../primitives/icon';
import { NavLink } from '../primitives/nav-link';
import { ScrollReveal } from '../primitives/scroll-reveal';

type EditableProps = Record<string, string | undefined>;

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  editableProps?: { eyebrow?: EditableProps; title?: EditableProps; description?: EditableProps };
};

export function SectionHeading(props: SectionHeadingProps) {
  const { eyebrow, title, description, href, linkLabel, editableProps } = props;
  return (
    <ScrollReveal>
      <Box
        sx={{
          position: 'relative',
          mb: { xs: 4, md: 4.5 },
          pb: 3,
          borderBottom: 1,
          borderColor: 'divider',
          '&::before, &::after': {
            position: 'absolute',
            bottom: '-0.25rem',
            width: '1px',
            height: '0.5rem',
            content: '""',
            bgcolor: 'divider',
          },
          '&::before': { left: 0 },
          '&::after': { right: 0 },
        }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          {...editableProps?.eyebrow}
          sx={{ display: 'block', mb: 1.25 }}
        >
          {eyebrow}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' },
            columnGap: 3,
            rowGap: 1.25,
            alignItems: 'baseline',
          }}
        >
          <Typography
            variant="h2"
            {...editableProps?.title}
            sx={{ fontSize: { xs: '1.75rem', md: '2rem' }, maxWidth: '28ch' }}
          >
            {title}
          </Typography>
          {href && linkLabel && (
            <NavLink
              href={href}
              underline="none"
              sx={{
                gridRow: { xs: 3, sm: 1 },
                gridColumn: { xs: 1, sm: 2 },
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                whiteSpace: 'nowrap',
                fontSize: '.9rem',
                fontWeight: 600,
              }}
            >
              {linkLabel} <Icon name="north-east" size={15} />
            </NavLink>
          )}
          {description && (
            <Typography
              color="text.secondary"
              {...editableProps?.description}
              sx={{ gridColumn: 1, gridRow: 2, maxWidth: '62ch' }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>
    </ScrollReveal>
  );
}
