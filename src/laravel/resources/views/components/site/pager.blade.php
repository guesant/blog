@props(['paginator'])
@php
    $paginator = $paginator->appends(request()->query());
    $lastPage = $paginator->lastPage();
    $currentPage = $paginator->currentPage();

    $pages = [];
    if ($lastPage > 1) {
        $start = max(1, $currentPage - 2);
        $end = min($lastPage, $currentPage + 2);

        if ($start > 1) {
            $pages[] = 1;
            if ($start > 2) {
                $pages[] = '...';
            }
        }

        for ($page = $start; $page <= $end; $page++) {
            $pages[] = $page;
        }

        if ($end < $lastPage) {
            if ($end < $lastPage - 1) {
                $pages[] = '...';
            }
            $pages[] = $lastPage;
        }
    }
@endphp
@if ($paginator->onLastPage())
    <x-site.list-footnote :cat="true">{{ __('pager.that_is_all') }}</x-site.list-footnote>
@endif
@if ($lastPage > 1)
    <nav
        class="pager"
        aria-label="{{ __('pager.page') }}"
    >
        @if (!$paginator->onFirstPage())
            <a
                class="pager-link"
                href="{{ $paginator->previousPageUrl() }}"
                rel="prev"
            >{{ __('pager.previous') }}</a>
        @else
            <span class="pager-link pager-disabled">{{ __('pager.previous') }}</span>
        @endif

        @foreach ($pages as $page)
            @if ($page === '...')
                <span class="pager-ellipsis">&hellip;</span>
            @elseif($page === $currentPage)
                <span
                    class="pager-current"
                    aria-current="page"
                >{{ $page }}</span>
            @else
                <a
                    class="pager-link"
                    href="{{ $paginator->url($page) }}"
                >{{ $page }}</a>
            @endif
        @endforeach

        @if (!$paginator->onLastPage())
            <a
                class="pager-link"
                href="{{ $paginator->nextPageUrl() }}"
                rel="next"
            >{{ __('pager.next') }}</a>
        @else
            <span class="pager-link pager-disabled">{{ __('pager.next') }}</span>
        @endif
    </nav>
@endif
