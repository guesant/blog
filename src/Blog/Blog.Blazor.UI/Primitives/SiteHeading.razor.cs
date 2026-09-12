namespace Blog.Blazor.UI.Primitives;

public partial class SiteHeading
{
    /// <summary>Heading level, 1-6, controls the rendered element. Values outside this range render as an h6.</summary>
    [Parameter, EditorRequired]
    public int Level { get; set; }

    /// <summary>Visual size level, 1-6; falls back to <see cref="Level"/> when not set.</summary>
    [Parameter]
    public int? Visual { get; set; }

    /// <summary>Element id, useful as an anchor target.</summary>
    [Parameter]
    public string? Id { get; set; }

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private string RootClass => SiteCss.Join("site-heading", Class);

    private int ResolvedVisual => Math.Clamp(Visual ?? Level, 1, 6);

    private IReadOnlyDictionary<string, object> ForwardedAttributes =>
        AdditionalAttributes ?? new Dictionary<string, object>();
}
