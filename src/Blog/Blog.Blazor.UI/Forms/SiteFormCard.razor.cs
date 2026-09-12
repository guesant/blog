namespace Blog.Blazor.UI.Forms;

public partial class SiteFormCard
{
    /// <summary>Plain-text label rendered as the card's accessible name.</summary>
    [Parameter]
    public string? Label { get; set; }

    /// <summary>Invisible accessible name, used only when there is no visible Label or LabelContent.</summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>Rich label content, takes precedence over Label.</summary>
    [Parameter]
    public RenderFragment? LabelContent { get; set; }

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private readonly string _headingId = $"form-card-{Guid.NewGuid():N}";
    private bool HasLabel => LabelContent is not null || !string.IsNullOrWhiteSpace(Label);
    private string RootClass => SiteCss.Join("site-form-card border", Class);
}
