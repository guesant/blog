using Blog.Blazor.Core;
using Microsoft.AspNetCore.Components;

namespace Blog.Blazor.Client;

public abstract class ContentPageBase : LocalizedComponentBase, IDisposable
{
    [Inject]
    protected IPublicSiteContentProvider ContentProvider { get; set; } = default!;

    [Inject]
    protected INotFoundResponder NotFoundResponder { get; set; } = default!;

    [Inject]
    private PersistentComponentState PersistentState { get; set; } = default!;

    protected PublicSiteSnapshot? Snapshot { get; private set; }

    protected virtual bool IsNotFound => false;

    private PersistingComponentStateSubscription _persistingSubscription;

    // IMPORTANT: without this, the snapshot the server already read during static prerendering is
    // thrown away the moment the WebAssembly runtime boots and re-runs this same lifecycle: the
    // browser-side provider re-fetches over HTTP, and every visitor sees the listing flash to
    // "temporarily unavailable" for as long as that request takes, on every single page load.
    protected override async Task OnInitializedAsync()
    {
        var stateKey = $"{nameof(ContentPageBase)}:{CurrentLocale}";
        if (PersistentState.TryTakeFromJson<PublicSiteSnapshot>(stateKey, out var restored))
        {
            Snapshot = restored;
        }
        else
        {
            Snapshot = await ContentProvider.GetAsync(CurrentLocale);
            _persistingSubscription = PersistentState.RegisterOnPersisting(
                () =>
                {
                    PersistentState.PersistAsJson(stateKey, Snapshot);
                    return Task.CompletedTask;
                },
                RenderMode.InteractiveWebAssembly
            );
        }

        if (IsNotFound)
            NotFoundResponder.MarkNotFound();
    }

    public void Dispose()
    {
        _persistingSubscription.Dispose();
        GC.SuppressFinalize(this);
    }

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
