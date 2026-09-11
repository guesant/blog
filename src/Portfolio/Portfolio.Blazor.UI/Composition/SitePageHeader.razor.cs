namespace Portfolio.Blazor.UI.Composition;

public partial class SitePageHeader
{
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    [Parameter]
    public string? Eyebrow { get; set; }

    [Parameter]
    public string? BackHref { get; set; }

    [Parameter]
    public string? BackLabel { get; set; }

    [Parameter]
    public RenderFragment? Actions { get; set; }

    [Parameter]
    public string? Class { get; set; }

    private string RootClass => SiteCss.Join("site-page-header", Class);
}
