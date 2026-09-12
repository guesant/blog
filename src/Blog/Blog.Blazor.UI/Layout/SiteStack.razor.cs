namespace Blog.Blazor.UI.Layout;

public partial class SiteStack
{
    /// <summary>Gap between stacked children.</summary>
    [Parameter]
    public SiteSpace Gap { get; set; } = SiteSpace.Md;

    /// <summary>Cross-axis alignment of the stacked children.</summary>
    [Parameter]
    public SiteAlign Align { get; set; } = SiteAlign.Stretch;

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private string RootClass => SiteCss.Join("site-stack", Class);

    private string GapToken => SiteTokens.Gap(Gap);

    private string AlignToken => SiteTokens.Align(Align);

    private IReadOnlyDictionary<string, object> ForwardedAttributes =>
        AdditionalAttributes ?? new Dictionary<string, object>();
}
