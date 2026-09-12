namespace Blog.Blazor.UI.Composition;

public partial class SiteRepeatableItems<TItem>
{
    [Parameter, EditorRequired]
    public IReadOnlyList<TItem> Items { get; set; } = [];

    [Parameter, EditorRequired]
    public Func<TItem, int, string> ItemTitle { get; set; } = default!;

    [Parameter, EditorRequired]
    public RenderFragment<SiteRepeatableItemContext<TItem>> ItemTemplate { get; set; } = default!;

    [Parameter]
    public string AddLabel { get; set; } = "Add";

    [Parameter]
    public string RemoveLabel { get; set; } = "Remove";

    [Parameter, EditorRequired]
    public EventCallback OnAdd { get; set; }

    [Parameter, EditorRequired]
    public EventCallback<int> OnRemove { get; set; }
}
