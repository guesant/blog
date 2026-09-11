using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class ExploreSection
{
    [Parameter, EditorRequired]
    public string HeadingId { get; set; } = string.Empty;

    private sealed record Tile(string Icon, string Label, string Href);

    private IReadOnlyList<Tile> Tiles =>
        [
            new("pen-line", NavL["writing"], FeedUrls.ForKind(FeedUrls.Writing)),
            new("lightbulb", NavL["findings"], FeedUrls.ForKind(FeedUrls.Finding)),
            new("archive", NavL["collections"], FeedUrls.ForKind(FeedUrls.Collection)),
            new("layout-list", NavL["topics"], LocalizedUrls.Current("/topics")),
            new("git-branch", NavL["knowledge_map"], LocalizedUrls.Current("/knowledge-map")),
            new("folder-git-2", NavL["projects"], LocalizedUrls.Current("/projects")),
            new("briefcase", NavL["cases"], LocalizedUrls.Current("/cases")),
            new("wrench", NavL["tools"], LocalizedUrls.Current("/tools")),
        ];
}
