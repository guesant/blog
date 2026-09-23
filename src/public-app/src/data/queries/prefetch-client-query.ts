type PrefetchClientQueryProps = {
  request: () => Promise<unknown>;
};

export function prefetchClientQuery(props: PrefetchClientQueryProps): void {
  if (typeof window === 'undefined') {
    return;
  }

  void props.request();
}
