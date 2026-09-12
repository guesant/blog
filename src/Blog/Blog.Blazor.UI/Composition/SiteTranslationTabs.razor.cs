namespace Blog.Blazor.UI.Composition;

public partial class SiteTranslationTabs
{
    [Parameter, EditorRequired]
    public IReadOnlyList<SiteLocaleTab> Locales { get; set; } = [];

    [Parameter, EditorRequired]
    public string ActiveLocale { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public EventCallback<string> ActiveLocaleChanged { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment<string> Panel { get; set; } = default!;

    [Parameter]
    public string TabListLabel { get; set; } = "translations";

    [Parameter]
    public string IdPrefix { get; set; } = "translation";

    private Dictionary<string, object> TabListAttributes =>
        new() { ["class"] = "site-translation-tablist", ["aria-label"] = TabListLabel };

    private static Dictionary<string, object> TabTriggerAttributes =>
        new() { ["class"] = "site-translation-tab" };

    private static Dictionary<string, object> PanelAttributes =>
        new() { ["class"] = "site-translation-panel" };
}
