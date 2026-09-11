namespace Portfolio.Blazor.UI.DataDisplay;

public partial class SiteCard
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

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private string RootClass => SiteCss.Join("site-card", Class);
}
