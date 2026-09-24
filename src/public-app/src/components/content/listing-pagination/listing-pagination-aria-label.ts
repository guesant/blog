type ListingPaginationAriaLabelProps = {
  type: string;
  page: number;
  ariaLabel: string;
  firstLabel: string;
  previousLabel: string;
  nextLabel: string;
  lastLabel: string;
};

export function listingPaginationAriaLabel(props: ListingPaginationAriaLabelProps) {
  const labels: Record<string, string> = {
    first: props.firstLabel,
    previous: props.previousLabel,
    next: props.nextLabel,
    last: props.lastLabel,
  };

  return props.type === 'page'
    ? `${props.ariaLabel}: ${props.page}`
    : (labels[props.type] ?? props.ariaLabel);
}
