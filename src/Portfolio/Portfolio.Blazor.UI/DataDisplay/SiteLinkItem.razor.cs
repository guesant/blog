namespace Portfolio.Blazor.UI.DataDisplay;

public partial class SiteLinkItem
{
    [Parameter, EditorRequired]
    public string Href { get; set; } = string.Empty;

    /// <summary>Primary text of the row.</summary>
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary>Secondary text under the label, typically the host or purpose.</summary>
    [Parameter]
    public string? Meta { get; set; }

    /// <summary>Small trailing tag, e.g. "free".</summary>
    [Parameter]
    public string? Badge { get; set; }

    /// <summary>Icon standing for the destination, e.g. "github" or "globe".</summary>
    [Parameter]
    public string Icon { get; set; } = "link";

    [Parameter]
    public string? Title { get; set; }

    /// <summary>Opens in a new tab and shows the outbound arrow.</summary>
    [Parameter]
    public bool External { get; set; } = true;

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    private string RootClass => SiteCss.Join("site-link-item", Class);
}
