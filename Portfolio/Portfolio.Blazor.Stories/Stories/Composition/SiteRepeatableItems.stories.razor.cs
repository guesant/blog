namespace Portfolio.Blazor.Stories.Stories.Composition;

public partial class SiteRepeatableItems_stories
{
    private readonly List<string> _items = ["first", "second"];

    private void AddItem() => _items.Add($"item {_items.Count + 1}");

    private void RemoveItem(int index) => _items.RemoveAt(index);
}
