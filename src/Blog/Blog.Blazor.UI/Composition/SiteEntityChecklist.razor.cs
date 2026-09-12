namespace Blog.Blazor.UI.Composition;

public partial class SiteEntityChecklist<TItem>
{
    [Parameter, EditorRequired]
    public IReadOnlyList<TItem> Items { get; set; } = [];

    [Parameter, EditorRequired]
    public Func<TItem, int> Key { get; set; } = default!;

    [Parameter, EditorRequired]
    public Func<TItem, string> Label { get; set; } = default!;

    [Parameter, EditorRequired]
    public HashSet<int> Selected { get; set; } = [];

    [Parameter]
    public EventCallback<HashSet<int>> SelectedChanged { get; set; }

    /// <summary>Placeholder of the searchable picker used to link a new item.</summary>
    [Parameter]
    public string SearchPlaceholder { get; set; } = "Search…";

    /// <summary>Message shown inside the picker when the search matches nothing.</summary>
    [Parameter]
    public Func<string, string> EmptyText { get; set; } =
        search => $"Nothing matches \"{search}\".";

    /// <summary>Message shown under the picker while nothing is linked yet.</summary>
    [Parameter]
    public string EmptyLinkedText { get; set; } = "Nothing linked yet.";

    [Parameter]
    public string AddLabel { get; set; } = "add";

    [Parameter]
    public string RemoveLabel { get; set; } = "remove";

    /// <summary>How many unlinked options the picker lists before offering to show more; keeps the
    /// popup bounded no matter how many entities exist.</summary>
    [Parameter]
    public int PageSize { get; set; } = 20;

    [Parameter]
    public string? Legend { get; set; }

    private string _pending = string.Empty;

    private List<TItem> LinkedItems => Items.Where(item => Selected.Contains(Key(item))).ToList();

    private IReadOnlyList<SiteSelectOption> AvailableOptions =>
        Items
            .Where(item => !Selected.Contains(Key(item)))
            .Select(item => new SiteSelectOption(Key(item).ToString(), Label(item)))
            .ToList();

    private Task HandleAddAsync()
    {
        if (!int.TryParse(_pending, out var key))
            return Task.CompletedTask;
        _pending = string.Empty;
        return HandleToggleAsync(key, true);
    }

    private Task HandleToggleAsync(int key, bool isSelected)
    {
        if (isSelected)
        {
            Selected.Add(key);
        }
        else
        {
            Selected.Remove(key);
        }

        return SelectedChanged.InvokeAsync(Selected);
    }
}
