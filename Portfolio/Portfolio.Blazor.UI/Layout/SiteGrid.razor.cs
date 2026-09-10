namespace Portfolio.Blazor.UI.Layout;

public partial class SiteGrid
{
    /// <summary>Every item takes the full row; the shell is too narrow for side-by-side columns to
    /// stay readable. Kept as a data attribute so page CSS (e.g. the snippet viewer) can opt into
    /// its own arrangement.</summary>
    [Parameter]
    public int Columns { get; set; } = 1;

    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object> AdditionalAttributes { get; set; } = new();

    private string RootClass => SiteCss.Join("site-grid", Class);
}
