namespace Blog.Blazor.UI.DataDisplay;

public partial class SiteCardMetaItem
{
    [Parameter, EditorRequired]
    public string Icon { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
