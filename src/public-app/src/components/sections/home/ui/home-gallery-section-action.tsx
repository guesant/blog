import { Box } from '../../../ui';
import { NavLink } from '../../../primitives/nav-link';
import { ContentNavigationActionIcon } from '../../../content/content-navigation-action-icon';
import { ActionButton } from '../../../ui/semantic/ActionButton';

type HomeGallerySectionActionProps = {
  action: string;
  href: string;
};

export function HomeGallerySectionAction(props: HomeGallerySectionActionProps) {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        px: 'var(--site-action-px)',
      }}
    >
      <ActionButton
        component={NavLink}
        href={props.href}

        sx={{
          maxWidth: '100%',
          minWidth: 0,
          paddingInline: 'var(--site-action-px)',
          whiteSpace: 'normal',
        }}
        endIcon={<ContentNavigationActionIcon direction="forward" />}
      >
        {props.action}
      </ActionButton>
    </Box>
  );
}
