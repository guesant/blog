namespace Portfolio.Blazor.UI.DataDisplay;

public partial class SiteCardMeta
{
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
