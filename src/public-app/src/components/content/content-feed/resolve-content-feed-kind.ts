type ResolveContentFeedKindProps = {
  fixedKind?: string;
  filterKind?: string;
  kind: string;
};

export function resolveContentFeedKind(props: ResolveContentFeedKindProps): string {
  return props.fixedKind || props.filterKind || props.kind;
}
