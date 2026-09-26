import { Box, Button, Typography } from '../../ui';
import type { Topic } from '@portfolio/data/domain/types';
import type { CommonTranslator } from '@/i18n/compat-support';
import { ArrowForward } from '../../ui';
import { NavLink } from '../../primitives/nav-link';

type TopicListItemProps = {
  topic: Topic;
  t: CommonTranslator;
};

export function TopicListItem(props: TopicListItemProps) {
  return (
    <Box visualVariant="topicItem">
      <Typography component="h2" visualVariant="topicTitle">
        <NavLink
          href={props.topic.url ?? `/topics/${props.topic.slug}`}
          underline="none"
          color="inherit"
        >
          {props.topic.name}
        </NavLink>
      </Typography>
      <Button
        component={NavLink}
        href={props.topic.url ?? `/topics/${props.topic.slug}`}
        size="small"
        variant="outlined"
        endIcon={<ArrowForward visualVariant="topicArrow" />}
        visualVariant="topicExplore"
      >
        {props.t('explore')}
      </Button>
    </Box>
  );
}
