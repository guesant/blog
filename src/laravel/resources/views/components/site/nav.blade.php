@props(['currentLocale', 'baseRouteName' => null, 'routeParams' => []])
@php
    $navQuery = new \App\Content\NavQuery();
    $activeItem = $navQuery->activeItem($baseRouteName);
    $activeParent = $navQuery->activeParent($baseRouteName);
    $sidebarGroupLabels = [
        0 => __('nav.group_content'),
        1 => __('nav.group_explore'),
        2 => __('nav.group_utilities'),
        3 => __('nav.group_about'),
    ];
    $navUrl = function (string $name) use ($currentLocale) {
        $routeName = \App\Content\Locale::routeName($name, $currentLocale);

        return \Illuminate\Support\Facades\Route::has($routeName)
            ? route($routeName)
            : \App\Content\Locale::url($name === 'home' ? '/' : "/{$name}", $currentLocale);
    };
@endphp
<div class="site-nav-topbar">
    <a
        href="{{ $navUrl('home') }}"
        class="site-nav-brand"
    >guesant.net</a>
    <button
        type="button"
        class="site-nav-toggle"
        data-nav-toggle
        aria-expanded="false"
        aria-controls="site-nav"
    >
        <x-site.icon name="menu" />
        <span>{{ __('nav.menu') }}</span>
    </button>
</div>
<div
    class="site-nav-backdrop"
    data-nav-backdrop
></div>
<aside
    class="site-nav"
    id="site-nav"
    data-nav-panel
>
    <a
        href="{{ $navUrl('home') }}"
        class="site-nav-brand"
    >guesant.net</a>
    <nav
        class="site-nav-links"
        aria-label="{{ __('nav.menu') }}"
    >
        @foreach ($navQuery->sidebarGroups($currentLocale) as $groupIndex => $group)
            @if ($groupIndex > 0)
                <hr class="site-nav-divider">
            @endif
            @if ($sidebarGroupLabels[$groupIndex] ?? false)
                <p class="site-nav-group-label">{{ $sidebarGroupLabels[$groupIndex] }}</p>
            @endif
            <ul>
                @foreach ($group as $item)
                    <li>
                        <x-site.nav-item
                            :href="$navUrl($item['route'])"
                            :label="$item['label']"
                            :route="$item['route']"
                            :active="$activeItem === $item['route']"
                            :active-parent="$activeParent === $item['route']"
                        />
                        @if ($item['children'] ?? false)
                            <ul class="site-nav-sub">
                                @foreach ($item['children'] as $child)
                                    <li><x-site.nav-item
                                            :href="$navUrl($child['route'])"
                                            :label="$child['label']"
                                            :route="$child['route']"
                                            :active="$activeItem === $child['route']"
                                        />
                                    </li>
                                @endforeach
                            </ul>
                        @endif
                    </li>
                @endforeach
            </ul>
        @endforeach

        <div class="site-nav-footer-links">
            <hr class="site-nav-divider">
            <ul>
                @foreach ($navQuery->footerLinkItems($currentLocale) as $item)
                    <li><x-site.nav-item
                            :href="$navUrl($item['route'])"
                            :label="$item['label']"
                            :route="$item['route']"
                            :active="$activeItem === $item['route']"
                        /></li>
                @endforeach
            </ul>
        </div>
    </nav>
    <x-site.lang-switch
        :current-locale="$currentLocale"
        :base-route-name="$baseRouteName"
        :route-params="$routeParams"
    />
</aside>
