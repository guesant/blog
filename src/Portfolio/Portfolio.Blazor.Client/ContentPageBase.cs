using Microsoft.AspNetCore.Components;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client;

public abstract class ContentPageBase : LocalizedComponentBase
{
    [Inject]
    protected IPublicSiteContentProvider ContentProvider { get; set; } = default!;

    protected PublicSiteSnapshot? Snapshot { get; private set; }

    protected override async Task OnInitializedAsync() =>
        Snapshot = await ContentProvider.GetAsync(CurrentLocale);

    protected string CrumbLabel(string route, string fallback)
    {
        var label = NavigationItems()
            .FirstOrDefault(item => LastSegment(item.Route) == route)
            ?.Label;
        return string.IsNullOrWhiteSpace(label) ? fallback : label.ToLowerInvariant();
    }

    private IEnumerable<PublicNavigationItem> NavigationItems()
    {
        if (Snapshot is null)
            return [];
        var navigation = Snapshot.Chrome.Navigation;
        return navigation
            .Sidebar.SelectMany(group => group)
            .Concat(navigation.Sitemap ?? [])
            .SelectMany(item => (item.Children ?? []).Prepend(item));
    }

    private static string LastSegment(string route) =>
        route.Trim('/').Split('/', StringSplitOptions.RemoveEmptyEntries).LastOrDefault()
        ?? string.Empty;
}
