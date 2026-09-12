namespace Blog.Blazor.UI.DataDisplay;

public partial class SiteListItem
{
    /// <summary>When set, the item renders as a clickable link instead of a static row.</summary>
    [Parameter]
    public string? Href { get; set; }

    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private bool IsLink => !string.IsNullOrWhiteSpace(Href);
    private string StaticClass => SiteCss.Join("list-group-item site-list-row", Class);
    private string LinkClass =>
        SiteCss.Join("list-group-item list-group-item-action site-list-item", Class);
}
