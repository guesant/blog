type BuildFeedTopicsProps = {
  topics?: Array<{ name: string; slug?: string }>;
};

export function buildFeedTopics(props: BuildFeedTopicsProps) {
  return props.topics ?? [];
}
