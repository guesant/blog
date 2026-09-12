namespace Blog.Blazor.Stories.Stories.Composition;

public partial class SiteEntityChecklist_stories
{
    private static readonly string[] Technologies = Enumerable
        .Range(1, 45)
        .Select(index => $"technology {index:00}")
        .ToArray();

    private HashSet<int> _selected = [0, 3];
}
