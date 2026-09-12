namespace Blog.Blazor.UI.Primitives;

public partial class SiteBadgeGroup
{
    /// <summary>Optional aria-label for the group.</summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private string RootClass => SiteCss.Join("tool-badge-list", "d-flex", "flex-wrap", Class);
}
