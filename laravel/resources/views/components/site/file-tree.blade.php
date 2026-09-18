@props(['tree'])
<ul class="file-tree">
    @foreach ($tree['dirs'] as $name => $subtree)
        <li class="file-tree-dir">
            <span class="file-tree-dir-name">{{ $name }}</span>
            <x-site.file-tree :tree="$subtree" />
        </li>
    @endforeach
    @foreach ($tree['files'] as $entry)
        <li>
            <button
                type="button"
                class="file-tree-file"
                data-file-id="{{ $entry['file']->id }}"
            >{{ $entry['name'] }}</button>
        </li>
    @endforeach
</ul>
