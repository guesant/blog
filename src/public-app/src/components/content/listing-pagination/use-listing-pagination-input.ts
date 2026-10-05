'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { boundedListingPage } from './bounded-listing-page';

type UseListingPaginationInputProps = {
  page: number;
  pageCount: number;
  onNavigate: (page: number) => void;
};

export function useListingPaginationInput(props: UseListingPaginationInputProps) {
  const [inputValue, setInputValue] = useState(String(props.page));

  useEffect(() => {
    setInputValue(String(props.page));
  }, [props.page]);

  const commit = () => {
    const requestedPage = Number(inputValue);

    const nextPage = Number.isInteger(requestedPage)
      ? boundedListingPage(requestedPage, props.pageCount)
      : props.page;

    setInputValue(String(nextPage));

    if (nextPage !== props.page) {
      props.onNavigate(nextPage);
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value.replace(/[^0-9]/g, ''));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    commit();
  };

  return { inputValue, onChange, onSubmit, commit };
}
