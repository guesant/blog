import type { FeedSelectDefinition } from './feed-select.types';
import { buildContentKindOptions } from './build-content-kind-options';

type BuildContentKindSelectProps = {
  fixedKind?: string;
  availableKindCount: number;
  kind: string;
  writingsCount: number;
  findingsCount: number;
  collectionsCount: number;
  label: string;
  onChange: (value: string) => void;
  writingLabel: string;
  findingsLabel: string;
  collectionsLabel: string;
};

export function buildContentKindSelect(
  props: BuildContentKindSelectProps,
): FeedSelectDefinition | undefined {
  if (props.fixedKind || props.availableKindCount <= 1) {
    return undefined;
  }

  return {
    id: 'content-kind',
    label: props.label,
    icon: 'filter',
    value: props.kind,
    clearValue: 'all',
    onChange: props.onChange,
    options: buildContentKindOptions(props),
  };
}
