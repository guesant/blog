using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Shared;

public partial class AdminNav
{
    private sealed record NavItem(string Href, string Icon, string Label);

    private sealed record NavGroupDef(string Label, NavItem[] Items);

    private static readonly NavGroupDef[] NavGroups =
    [
        new(
            "content",
            [
                new("/admin/projects", "folder", "Projects"),
                new("/admin/case-studies", "briefcase", "Case studies"),
                new("/admin/experiments", "flask-conical", "Experiments"),
                new("/admin/writings", "pen-line", "Writings"),
                new("/admin/snippets", "code", "Snippets"),
                new("/admin/findings", "lightbulb", "Findings"),
                new("/admin/collections", "archive", "Collections"),
            ]
        ),
        new(
            "taxonomy",
            [
                new("/admin/credits", "award", "Credits"),
                new("/admin/topics", "list", "Topics"),
                new("/admin/technologies", "cpu", "Technologies"),
                new("/admin/languages", "languages", "Languages"),
            ]
        ),
        new(
            "site",
            [
                new("/admin/profile", "user", "Profile"),
                new("/admin/site-settings", "settings", "Site settings"),
                new("/admin/resume", "file-text", "Resume"),
                new("/admin/pages", "file", "Pages"),
                new("/admin/nav-items", "navigation", "Nav items"),
            ]
        ),
    ];

    private bool IsActive(string href) =>
        new Uri(Navigation.Uri)
            .AbsolutePath.TrimEnd('/')
            .Equals(href.TrimEnd('/'), StringComparison.OrdinalIgnoreCase);
}
