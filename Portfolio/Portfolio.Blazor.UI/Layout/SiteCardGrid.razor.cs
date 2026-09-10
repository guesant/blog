namespace Portfolio.Blazor.UI.Layout;

public partial class SiteCardGrid
{
    [Parameter]
    public string? Class { get; set; }

    /// <summary>Packs small tiles side by side (auto-fill, --site-tile-min-w) instead of one item per row.</summary>
    [Parameter]
    public bool Dense { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object> AdditionalAttributes { get; set; } = new();
}
