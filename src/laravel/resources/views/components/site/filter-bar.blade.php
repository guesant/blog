@props(['form' => false, 'method' => 'GET'])
@if ($form)
    <form method="{{ $method }}">
        <div {{ $attributes->merge(['class' => 'filter-bar']) }}>{{ $slot }}</div>
    </form>
@else
    <div {{ $attributes->merge(['class' => 'filter-bar']) }}>{{ $slot }}</div>
@endif
