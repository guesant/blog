type ResolveContentFeedKindProps = {
  fixedKind?: string;
  filterKind?: string;
  filterType?: string;
  kind: string;
};

export function resolveContentFeedKind(props: ResolveContentFeedKindProps): string {
  return props.fixedKind || props.filterKind || (props.filterType ? 'achado' : props.kind);
}
