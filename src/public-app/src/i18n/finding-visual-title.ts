import { findingDisplayTitle } from './finding-display-title';

type FindingVisualTitleProps = {
  title: string;
  typeLabel?: string;
};

export function findingVisualTitle(props: FindingVisualTitleProps): string {
  const title = findingDisplayTitle(props);

  return props.typeLabel ? `| ${title}` : title;
}
