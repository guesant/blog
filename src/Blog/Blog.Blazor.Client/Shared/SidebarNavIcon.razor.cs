namespace Blog.Blazor.Client.Shared;

public partial class SidebarNavIcon
{
    [Parameter, EditorRequired]
    public string Route { get; set; } = string.Empty;

    [Parameter]
    public bool Active { get; set; }

    private string? ResolvedIconName =>
        Route
            .ToLowerInvariant()
            .Trim('/')
            .Split(['/', '.'], StringSplitOptions.RemoveEmptyEntries)
            .LastOrDefault() switch
        {
            "home" => "house",
            "writing" or "writings" => "pen-line",
            "finding" or "findings" => "lightbulb",
            "topic" or "topics" => "layout-list",
            "collection" or "collections" => "archive",
            "knowledge-map" or "knowledge_map" or "map" => "git-branch",
            "snippet" or "snippets" => "copy",
            "tool" or "tools" => "wrench",
            "about" => "user",
            "now" => "activity",
            "resume" => "file-text",
            "portfolio" => "layout-grid",
            "cases" => "briefcase",
            "projects" => "folder-git-2",
            "follow" or "follow-me" or "social" => "messages-square",
            _ => null,
        };
}
