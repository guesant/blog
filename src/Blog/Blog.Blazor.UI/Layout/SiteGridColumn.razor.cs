namespace Blog.Blazor.UI.Layout;

public partial class SiteGridColumn
{
    [Parameter]
    public string? Class { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object> AdditionalAttributes { get; set; } = new();

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private string RootClass => SiteCss.Join("site-grid-column", Class);
}
