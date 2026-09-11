namespace Portfolio.Blazor.UI.DataDisplay;

public partial class SiteRichText
{
    /// <summary>Trusted HTML content to render.</summary>
    [Parameter, EditorRequired]
    public MarkupString Html { get; set; }

    /// <summary>Optional layout region marker.</summary>
    [Parameter]
    public string? Region { get; set; }
}
