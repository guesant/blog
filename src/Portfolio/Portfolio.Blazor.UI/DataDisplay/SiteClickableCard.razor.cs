namespace Portfolio.Blazor.UI.DataDisplay;

public partial class SiteClickableCard
{
    /// <summary>Plain text shown in the card header.</summary>
    [Parameter]
    public string? Label { get; set; }

    /// <summary>Icon rendered before the header label.</summary>
    [Parameter]
    public string? Icon { get; set; }

    /// <summary>Custom header content, takes precedence over Label.</summary>
    [Parameter]
    public RenderFragment? LabelContent { get; set; }

    /// <summary>Link destination for the whole card.</summary>
    [Parameter, EditorRequired]
    public string Href { get; set; } = string.Empty;

    /// <summary>Title text, also used as the link's accessible name.</summary>
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    /// <summary>Class applied to the title heading, replacing its default typography.</summary>
    [Parameter]
    public string TitleClass { get; set; } = "h5";

    /// <summary>Heading level: 2 renders h2, 3 renders h3.</summary>
    [Parameter]
    public int HeadingLevel { get; set; } = 2;

    [Parameter]
    public string? Target { get; set; }

    [Parameter]
    public string? Rel { get; set; }

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    private string CardClass => SiteCss.Join("h-100 position-relative", Class);
}
