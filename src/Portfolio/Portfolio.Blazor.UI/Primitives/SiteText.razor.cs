namespace Portfolio.Blazor.UI.Primitives;

public partial class SiteText
{
    /// <summary>Text style to render.</summary>
    [Parameter]
    public SiteTextVariant Variant { get; set; } = SiteTextVariant.Body;

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private string RootClass => SiteCss.Join("site-text", Class);

    private bool IsInlineTag =>
        Variant
            is SiteTextVariant.Eyebrow
                or SiteTextVariant.SectionLabel
                or SiteTextVariant.Meta
                or SiteTextVariant.MetricLabel;

    private string VariantToken =>
        Variant switch
        {
            SiteTextVariant.Small => "small",
            SiteTextVariant.Eyebrow => "eyebrow",
            SiteTextVariant.SectionLabel => "section-label",
            SiteTextVariant.Lead => "lead",
            SiteTextVariant.Meta => "meta",
            SiteTextVariant.Excerpt => "excerpt",
            SiteTextVariant.MetricValue => "metric-value",
            SiteTextVariant.MetricLabel => "metric-label",
            _ => "body",
        };

    private IReadOnlyDictionary<string, object> ForwardedAttributes =>
        AdditionalAttributes ?? new Dictionary<string, object>();
}
