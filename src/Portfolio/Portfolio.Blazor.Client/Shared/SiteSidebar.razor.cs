using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class SiteSidebar
{
    [Parameter]
    public PublicSiteSnapshot? Snapshot { get; set; }

    [Parameter]
    public bool Right { get; set; }
    private static string NavigationLabel => "menu";
    private string HomeLabel => L["home"];
    private bool IsHome => RequestPath.TrimEnd('/') == LocalizedPath("home").TrimEnd('/');
    private bool IsAbout => IsRoute("about");
    private bool IsAboutChild => new[] { "portfolio", "resume", "cases", "projects" }.Any(IsRoute);
    private static IReadOnlyList<string> AboutChildren => ["resume", "portfolio", "cases"];

    private string NavLabel(string route) =>
        Lower(
            NavigationItems.FirstOrDefault(item => LastSegment(item.Route) == route)?.Label
                ?? string.Empty
        );

    private IEnumerable<PublicNavigationItem> NavigationItems =>
        Snapshot is null
            ? []
            : Snapshot
                .Chrome.Navigation.Sidebar.SelectMany(group => group)
                .SelectMany(item => (item.Children ?? []).Prepend(item));

    private bool IsRoute(string route) =>
        RequestPath
            .TrimEnd('/')
            .Equals(LocalizedPath(route).TrimEnd('/'), StringComparison.OrdinalIgnoreCase);

    private string LanguageLabel => L["language"];

    private static string Lower(string? value) => value?.ToLowerInvariant() ?? string.Empty;

    private sealed record SidebarGroup(string Label, IReadOnlyList<PublicNavigationItem> Items);

    private IReadOnlyList<SidebarGroup> SidebarGroups =>
        Snapshot is null
            ? [new SidebarGroup(NavL["group_tools"], [new PublicNavigationItem("tools", "tools")])]
            : Snapshot
                .Chrome.Navigation.Sidebar.SelectMany(group => group)
                .Where(ShowsInSidebar)
                .GroupBy(item => GroupLabel(item.Route))
                .Select(group => new SidebarGroup(group.Key, group.ToList()))
                .ToList();

    private string GroupLabel(string route) =>
        LastSegment(route) switch
        {
            "writing" or "findings" or "topics" or "collections" or "knowledge-map" => NavL[
                "group_content"
            ],
            _ => NavL["group_tools"],
        };

    private bool ShowsInSidebar(PublicNavigationItem item) =>
        !IsAboutRoute(item.Route) && HasContent(item.Route);

    private bool HasContent(string route) =>
        LastSegment(route) switch
        {
            "snippets" => Snapshot?.Snippets.Count > 0,
            "collections" => Snapshot?.Collections.Count > 0,
            "topics" => Snapshot?.Topics.Count > 0,
            "writing" => Snapshot?.Writings.Count > 0,
            "findings" => Snapshot?.Findings.Count > 0,
            _ => true,
        };

    private static string LastSegment(string route) =>
        route
            .Replace(".", "/", StringComparison.Ordinal)
            .Trim('/')
            .Split('/', StringSplitOptions.RemoveEmptyEntries)
            .LastOrDefault()
        ?? string.Empty;

    private static bool IsAboutRoute(string route) =>
        LastSegment(route) is "about" or "now" or "portfolio" or "cases" or "projects" or "resume";

    private bool IsActiveParent(PublicNavigationItem item) =>
        item.Children?.Any(child => IsCurrent(child.Route)) == true;

    private string RouteUrl(string route) =>
        LocalizedPath(route.Replace(".", "/", StringComparison.Ordinal));

    private bool IsCurrent(string route) =>
        RequestPath
            .TrimEnd('/')
            .Equals(RouteUrl(route).TrimEnd('/'), StringComparison.OrdinalIgnoreCase);

    private string LocalizedPath(string path) =>
        Urls.ForCulture(
            path.Equals("home", StringComparison.OrdinalIgnoreCase) ? "/" : path,
            Cultures.FromPath(RequestPath).Name
        );

    private string LanguageUrl(string locale)
    {
        var target = Urls.SwitchCulture(Navigation.Uri, locale);
        return $"/Culture/Set?culture={Uri.EscapeDataString(locale)}&redirectUri={Uri.EscapeDataString(target)}";
    }
}
