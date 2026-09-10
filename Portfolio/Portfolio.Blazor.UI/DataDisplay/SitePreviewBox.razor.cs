namespace Portfolio.Blazor.UI.DataDisplay;

public partial class SitePreviewBox
{
    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    /// <summary>Inline style bound to a live value (e.g. a CSS preview).</summary>
    [Parameter]
    public string? Style { get; set; }

    [Parameter]
    public string? AriaLabel { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private string RootClass => SiteCss.Join("site-preview-box", Class);
}
