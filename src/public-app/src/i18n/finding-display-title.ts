type FindingTitleProps = {
  title: string;
  typeLabel?: string;
};

export function findingDisplayTitle(props: FindingTitleProps): string {
  return props.typeLabel ? `[${props.typeLabel}] | ${props.title}` : props.title;
}
