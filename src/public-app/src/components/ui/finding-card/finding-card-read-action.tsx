import { ArrowForward } from '../arrow-forward';
import { VisuallyHidden } from '../visually-hidden';
import { NavLink } from '../../primitives/nav-link';
import { ActionButton } from '../semantic/ActionButton';

type FindingCardReadActionProps = {
  href: string;
  label: string;
  title: string;
  children: string;
};

const actionStyles = {
  flexShrink: 0,
  minHeight: 'var(--site-control-h-sm)',
  marginInlineStart: { xs: 0, sm: 'auto' },
  paddingInline: 'var(--site-space-2)',
  gap: 'var(--site-space-1)',
  color: 'var(--site-primary)',
  fontSize: 'var(--site-text-sm)',
  fontWeight: 'var(--site-weight-semibold)',
  textDecoration: 'none',
  textTransform: 'none',
  '&:hover': { backgroundColor: 'transparent', textDecoration: 'none' },
};

export function FindingCardReadAction(props: FindingCardReadActionProps) {
  return (
    <ActionButton
      component={NavLink}
      href={props.href}
      data-action="read-more"

      size="small"
      variant="outlined"
      aria-label={`${props.label}: ${props.title}`}
      endIcon={<ArrowForward sx={{ fontSize: 'var(--site-text-sm)' }} />}
      sx={actionStyles}
    >
      {props.children}
      <VisuallyHidden>{props.title}</VisuallyHidden>
    </ActionButton>
  );
}
