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

    private PersistingComponentStateSubscription _persistingSubscription;

    // IMPORTANT: without this, the snapshot the server already read during static prerendering is
    // thrown away the moment the WebAssembly runtime boots and re-runs this same lifecycle: both
    // sidebars go blank/stub for as long as the browser-side re-fetch takes, on every page load.
    protected override async Task OnInitializedAsync()
    {
        var locale = CultureCatalog.NormalizeName(CultureInfo.CurrentUICulture.Name);
        var stateKey = $"{nameof(MainLayout)}:{locale}";
        if (PersistentState.TryTakeFromJson<PublicSiteSnapshot>(stateKey, out var restored))
        {
            Snapshot = restored;
        }
        else
        {
            Snapshot = await ContentProvider.GetAsync(locale);
            _persistingSubscription = PersistentState.RegisterOnPersisting(
                () =>
                {
                    PersistentState.PersistAsJson(stateKey, Snapshot);
                    return Task.CompletedTask;
                },
                RenderMode.InteractiveWebAssembly
            );
        }
    }

    public void Dispose()
    {
        _persistingSubscription.Dispose();
        GC.SuppressFinalize(this);
    }
}
