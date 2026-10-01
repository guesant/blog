import type { Topic } from '@portfolio/data/domain/types';
import type { CommonTranslator } from '@/i18n/compat-support';
import { NavLink } from '../../primitives/nav-link';
import { TopicExploreArrowIcon } from '../../ui/semantic/TopicExploreArrowIcon';
import { TopicExploreButton } from '../../ui/semantic/TopicExploreButton';
import { TopicItemFrame } from '../../ui/semantic/TopicItemFrame';
import { TopicTitleText } from '../../ui/semantic/TopicTitleText';

type TopicListItemProps = {
  topic: Topic;
  t: CommonTranslator;
};

export function TopicListItem(props: TopicListItemProps) {
  return (
    <TopicItemFrame>
      <TopicTitleText component="h2">
        <NavLink
          href={props.topic.url ?? `/topics/${props.topic.slug}`}
          underline="none"
          color="inherit"
        >
          {props.topic.name}
        </NavLink>
      </TopicTitleText>
      <TopicExploreButton
        component={NavLink}
        href={props.topic.url ?? `/topics/${props.topic.slug}`}
        size="small"
        variant="outlined"
        endIcon={<TopicExploreArrowIcon />}
      >
        {props.t('explore')}
      </TopicExploreButton>
    </TopicItemFrame>
  );
}
