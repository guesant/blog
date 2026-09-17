using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Layout;

public partial class MainLayout
{
    private PublicSiteSnapshot? Snapshot { get; set; }
    private bool ShowRightSidebar => Snapshot?.Chrome.Visibility.RightSidebar == true;
    private System.Globalization.CultureInfo CurrentCulture =>
        Cultures.Normalize(System.Globalization.CultureInfo.CurrentUICulture.Name);

    private string LocalizedPath(string path) =>
        Urls.ForCulture(
            path.Equals("home", StringComparison.OrdinalIgnoreCase) ? "/" : path,
            CurrentCulture.Name
        );

    private string RequestPath => new Uri(Navigation.Uri).AbsolutePath;

    private string[] RouteSegments =>
        RequestPath
            .Split('/', StringSplitOptions.RemoveEmptyEntries)
            .SkipWhile(segment => Cultures.IsSupported(segment))
            .ToArray();

    private string? BackHref =>
        RouteSegments.Length switch
        {
            0 => null,
            1 => LocalizedPath("home"),
            _ => LocalizedPath($"/{RouteSegments[0]}"),
        };

    private string BackLabel =>
        RouteSegments.Length switch
        {
            0 => string.Empty,
            1 => L["home"],
            _ => RouteSegments[0] switch
            {
                "writing" => L["writings"],
                "findings" => L["findings"],
                "collections" => L["collections"],
                "snippets" => L["snippets"],
                "topics" => L["topics"],
                "technologies" => L["technologies"],
                "cases" => L["cases"],
                "projects" => L["projects"],
                var segment => segment,
            },
        };

    protected override async Task OnInitializedAsync() =>
        Snapshot = await ContentProvider.GetAsync(
            CultureCatalog.NormalizeName(CultureInfo.CurrentUICulture.Name)
        );
}
