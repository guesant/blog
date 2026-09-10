namespace Portfolio.Blazor.Stories.Stories.DataDisplay;

public partial class SiteDataTable_stories
{
    private sealed record SiteDataTableRow(int Id, string Name, string Role);

    private readonly IReadOnlyList<SiteDataTableRow> _rows =
    [
        new(1, "Ada", "Engineer"),
        new(2, "Grace", "Admiral"),
        new(3, "Alan", "Mathematician"),
    ];
}
