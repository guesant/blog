namespace Portfolio.Blazor.UI.DataDisplay;

public partial class SiteFeedCard
{
    /// <summary>Content type shown as the leading badge, e.g. "writing".</summary>
    [Parameter, EditorRequired]
    public string KindLabel { get; set; } = string.Empty;

    [Parameter]
    public string? Date { get; set; }

    [Parameter]
    public string? ReadingTime { get; set; }

    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    /// <summary>Destination of the title and of the inline "view" link; when empty the title
    /// renders as plain text and the link is omitted.</summary>
    [Parameter]
    public string? Href { get; set; }

    /// <summary>Opens Href in a new tab and swaps the trailing arrow for the outbound one.</summary>
    [Parameter]
    public bool External { get; set; }

    /// <summary>Extra items appended to the meta row, typically SiteCardMetaItem.</summary>
    [Parameter]
    public RenderFragment? MetaItems { get; set; }

    /// <summary>Plain-text preview of the body, already cut by the caller (see PlainTextExcerpt).</summary>
    [Parameter]
    public string? Preview { get; set; }

    /// <summary>Whether the preview was cut; renders the inline ellipsis before the view link.</summary>
    [Parameter]
    public bool Truncated { get; set; }

    /// <summary>Label of the inline link that opens the full content; empty hides the link.</summary>
    [Parameter]
    public string? ViewLabel { get; set; } = "read more";

    [Parameter]
    public string? ExternalUrl { get; set; }

    [Parameter]
    public string? ExternalLabel { get; set; }

    /// <summary>Optional trailing tags, typically a SiteChipGroup.</summary>
    [Parameter]
    public RenderFragment? Tags { get; set; }

    private bool HasMoreLink =>
        !string.IsNullOrWhiteSpace(Href) && !string.IsNullOrWhiteSpace(ViewLabel);
}
