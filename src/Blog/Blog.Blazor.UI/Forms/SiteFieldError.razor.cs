namespace Blog.Blazor.UI.Forms;

public partial class SiteFieldError
{
    [CascadingParameter]
    private SiteFieldContext Context { get; set; } = default!;

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
