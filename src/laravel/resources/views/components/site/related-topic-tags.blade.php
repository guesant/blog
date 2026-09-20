@props(['topics', 'currentLocale', 'limit' => null])
@php
    $topicsToShow = $limit !== null ? $topics->take($limit) : $topics;
@endphp
<x-site.tags :items="$topicsToShow->map(
    fn($relatedTopic) => [
        'label' => $relatedTopic->translation($currentLocale)?->name ?? $relatedTopic->slug,
        'href' => \App\Content\Locale::url('/topics/' . $relatedTopic->slug, $currentLocale),
    ],
)" />