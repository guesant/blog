namespace Portfolio.Blazor.UI.Layout;

public partial class SitePage
{
    /// <summary>Page template identifier, surfaced as data-page-template for CSS/JS hooks.</summary>
    [Parameter, EditorRequired]
    public string Template { get; set; } = string.Empty;

    [Parameter]
    public string Id { get; set; } = "main-content";

    [Parameter]
    public string? Class { get; set; }

    /// <summary>Breadcrumb rendered before the page content; callers opt in explicitly instead of relying on Template value.</summary>
    [Parameter]
    public RenderFragment? Breadcrumb { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object> AdditionalAttributes { get; set; } = new();

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
