namespace Blog.Blazor.UI.Composition;

public partial class SiteFormSection
{
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    [Parameter]
    public string? Description { get; set; }

    [Parameter]
    public string? HeadingId { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
