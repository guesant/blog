import { ArrowForward } from '../arrow-forward';
import { VisuallyHidden } from '../visually-hidden';
import { NavLink } from '../../primitives/nav-link';
import { ActionButton } from '../semantic/ActionButton';
import { Link } from '../link';

type FindingCardReadActionProps = {
  href: string;
  label: string;
  title: string;
  children: string;
  external?: boolean;
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
  const component = props.external ? Link : NavLink;

  return (
    <ActionButton
      component={component}
      href={props.href}
      {...(props.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
