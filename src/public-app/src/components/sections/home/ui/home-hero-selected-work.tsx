import { Button } from '../../../ui';
import { Icon } from '../../../primitives/icon';
import { Link as LocaleLink } from '../../../../i18n/navigation';

type HomeHeroSelectedWorkProps = {
  href: string;
  label: string;
};

export function HomeHeroSelectedWork(props: HomeHeroSelectedWorkProps) {
  return (
    <Button
      component={LocaleLink}
      href={props.href}
      size="large"
      variant="contained"
      endIcon={<Icon name="arrow" size={16} />}
      sx={{ width: '100%' }}
    >
      {props.label}
    </Button>
  );
}
