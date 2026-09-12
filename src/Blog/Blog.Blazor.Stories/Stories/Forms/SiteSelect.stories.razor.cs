namespace Blog.Blazor.Stories.Stories.Forms;

public partial class SiteSelect_stories
{
    private sealed class SelectModel
    {
        public string Selected { get; set; } = string.Empty;
    }

    private readonly SelectModel _model = new();

    private static readonly IReadOnlyList<SiteSelectOption> ManyOptions = Enumerable
        .Range(1, 60)
        .Select(index => new SiteSelectOption($"c{index}", $"Country {index:00}"))
        .ToList();

    private static readonly IReadOnlyList<SiteSelectOption> Options =
    [
        new SiteSelectOption("one", "One"),
        new SiteSelectOption("two", "Two"),
        new SiteSelectOption("three", "Three"),
    ];
}
