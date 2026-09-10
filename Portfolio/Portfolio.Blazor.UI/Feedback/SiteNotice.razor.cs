namespace Portfolio.Blazor.UI.Feedback;

public partial class SiteNotice
{
    /// <summary>Semantic tone, drives both color and the ARIA role.</summary>
    [Parameter]
    public SiteTone Tone { get; set; } = SiteTone.Neutral;

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private string Role => Tone is SiteTone.Warning or SiteTone.Danger ? "alert" : "status";

    private string ToneClass =>
        Tone switch
        {
            SiteTone.Info => "alert-info",
            SiteTone.Success => "alert-success",
            SiteTone.Warning => "alert-warning",
            SiteTone.Danger => "alert-danger",
            _ => "alert-light",
        };

    private string RootClass => SiteCss.Join("alert border tool-note", ToneClass, Class);
}
