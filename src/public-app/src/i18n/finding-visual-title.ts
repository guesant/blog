import { findingDisplayTitle } from './finding-display-title';

type FindingVisualTitleProps = {
  title: string;
  typeLabel?: string;
};

export function findingVisualTitle(props: FindingVisualTitleProps): string {
  return findingDisplayTitle(props);
}
