namespace Portfolio.Blazor.UI.Navigation;

public partial class SiteTileLink
{
    [Parameter, EditorRequired]
    public string Href { get; set; } = string.Empty;

    /// <summary>Icon stacked above the count/label. Optional when the tile leads with a count.</summary>
    [Parameter]
    public string? Icon { get; set; }

    /// <summary>Optional figure (e.g. "28") rendered large between icon and label.</summary>
    [Parameter]
    public string? Count { get; set; }

    /// <summary>Puts the count above the icon instead of below it.</summary>
    [Parameter]
    public bool CountFirst { get; set; }

    /// <summary>Optional title under the icon/count. At least one of Icon, Count or Label should be set.</summary>
    [Parameter]
    public string? Label { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
