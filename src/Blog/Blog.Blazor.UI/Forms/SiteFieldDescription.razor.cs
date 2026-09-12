namespace Blog.Blazor.UI.Forms;

public partial class SiteFieldDescription
{
    [CascadingParameter]
    private SiteFieldContext Context { get; set; } = default!;

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
