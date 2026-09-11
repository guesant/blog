namespace Portfolio.Blazor.UI.Composition;

public partial class SiteSortableList<TItem>
{
    /// <summary>The list to reorder, mutated in place: after a drop the dragged item is moved to its
    /// new index in this same list before <see cref="OnReordered"/> fires, so callers read the new
    /// order straight from it. (BbSortable itself only reports the indices; confirmed live, it leaves
    /// Items untouched and reverts the DOM, so without this move the drop would visually snap back.)</summary>
    [Parameter, EditorRequired]
    public IList<TItem> Items { get; set; } = [];

    [Parameter, EditorRequired]
    public RenderFragment<TItem> ItemTemplate { get; set; } = default!;

    /// <summary>Raised after a drop with the old and new index of the moved item.</summary>
    [Parameter]
    public EventCallback<(int OldIndex, int NewIndex)> OnReordered { get; set; }

    [Parameter]
    public string? AriaLabel { get; set; }

    [Parameter]
    public string HandleLabel { get; set; } = "drag to reorder";

    private Task HandleUpdate((int OldIndex, int NewIndex) change)
    {
        if (
            change.OldIndex != change.NewIndex
            && change.OldIndex >= 0
            && change.OldIndex < Items.Count
            && change.NewIndex >= 0
            && change.NewIndex < Items.Count
        )
        {
            var item = Items[change.OldIndex];
            Items.RemoveAt(change.OldIndex);
            Items.Insert(change.NewIndex, item);
        }

        return OnReordered.InvokeAsync(change);
    }
}
