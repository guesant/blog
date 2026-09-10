namespace Portfolio.Blazor.Stories.Stories.Forms;

public partial class SiteKeyValueFreeFormRows_stories
{
    private readonly List<(string Key, string Value)> _rows = [("legacyKey", "legacy value")];
    private IReadOnlyList<int> _indices => Enumerable.Range(0, _rows.Count).ToList();
}
