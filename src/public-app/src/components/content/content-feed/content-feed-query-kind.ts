type ContentFeedQueryKindProps = {
  fixedKind?: string;
  kind: string;
};

export function contentFeedQueryKind(props: ContentFeedQueryKindProps) {
  if (props.fixedKind || props.kind === 'all') {
    return '';
  }
  return props.kind;
}
