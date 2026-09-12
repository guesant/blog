namespace Blog.Blazor.UI.DataDisplay;

public partial class SiteList
{
    /// <summary>Visual treatment of the list.</summary>
    [Parameter]
    public SiteListVariant Variant { get; set; } = SiteListVariant.Plain;

    /// <summary>Renders an ol instead of a ul.</summary>
    [Parameter]
    public bool Ordered { get; set; }

    [Parameter]
    public string? AriaLabel { get; set; }

    [Parameter]
    public string? Id { get; set; }

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    private string VariantClass =>
        Variant switch
        {
            SiteListVariant.Surface => "list-group site-list-surface",
            SiteListVariant.Boxed => "site-text-list content-links",
            SiteListVariant.Steps => "tool-steps",
            _ => "list-group site-list tool-list",
        };

    private string RootClass => SiteCss.Join(VariantClass, Class);
}
