namespace Blog.Blazor.UI.Primitives;

public partial class SiteBadge
{
    /// <summary>Visible badge text.</summary>
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary>Semantic tone applied to the badge colours.</summary>
    [Parameter]
    public SiteTone Tone { get; set; } = SiteTone.Neutral;

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    private string RootClass => SiteCss.Join("badge", "border", "site-badge", Class);

    private string ToneToken => Tone.ToString().ToLowerInvariant();
}
