namespace Blog.Blazor.UI.Layout;

public partial class SiteHero
{
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    [Parameter]
    public RenderFragment? TitleContent { get; set; }

    [Parameter]
    public string? Lead { get; set; }

    [Parameter]
    public string? Meta { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>Controls pinned to the right end of the title row, such as page actions.</summary>
    [Parameter]
    public RenderFragment? Actions { get; set; }
}
