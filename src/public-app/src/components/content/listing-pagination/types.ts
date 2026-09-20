export type PaginationItem = number | 'ellipsis';

export type PaginationPageButtonProps = {
  value: PaginationItem;
  page: number;
  goToPage: (page: number) => void;
};

export function paginationItems(page: number, pageCount: number): PaginationItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const middlePage = Math.ceil(pageCount / 2);

  const pages = [...new Set([1, 2, page - 1, page, page + 1, middlePage, pageCount - 1, pageCount])]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((left, right) => left - right);

  const items: PaginationItem[] = [];

  pages.forEach((value, index) => {
    if (index > 0 && value - pages[index - 1] > 1) {
      items.push('ellipsis');
    }
    items.push(value);
  });

  return items;
}

export type ListingPaginationProps = {
  page: number;
  pageCount: number;
  ariaLabel: string;
  firstLabel: string;
  previousLabel: string;
  nextLabel: string;
  lastLabel: string;
  onPageChange: (page: number) => void | Promise<unknown>;
  scrollTargetId?: string;
};
