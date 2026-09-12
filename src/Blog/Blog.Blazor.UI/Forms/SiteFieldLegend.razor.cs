namespace Blog.Blazor.UI.Forms;

public partial class SiteFieldLegend
{
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
