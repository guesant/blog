using Blog.Blazor.Core.Localization;
using Microsoft.Extensions.Localization;

namespace Blog.Blazor.Client.Shared;

public static class FindingTypeCatalog
{
    public static readonly IReadOnlyList<string> Types =
    [
        "article",
        "book",
        "paper",
        "repo",
        "site",
        "docs",
        "tool",
        "course",
        "video",
        "playlist",
        "channel",
        "podcast",
        "film",
        "game",
        "entertainment",
        "other",
    ];

    public static string Label(string? type, IStringLocalizer<SharedResource> l) =>
        type?.ToLowerInvariant() switch
        {
            "book" => l["book"],
            "article" => l["article"],
            "paper" => "paper",
            "repo" => l["repository"],
            "site" => l["site"],
            "docs" => l["documentation"],
            "tool" => l["tool"],
            "course" => l["course"],
            "video" => l["video"],
            "playlist" => "playlist",
            "channel" => l["channel"],
            "podcast" => "podcast",
            "film" => l["film"],
            "game" => l["game"],
            "entertainment" => l["entertainment"],
            "other" => l["other"],
            _ => string.IsNullOrWhiteSpace(type) ? l["finding"] : type,
        };

    public static string Icon(string? type) =>
        type?.ToLowerInvariant() switch
        {
            "book" => "book-open",
            "article" => "newspaper",
            "paper" => "scroll-text",
            "repo" => "folder-git-2",
            "site" => "globe",
            "docs" => "file-text",
            "tool" => "wrench",
            "course" => "graduation-cap",
            "video" => "video",
            "playlist" => "list-video",
            "channel" => "tv",
            "podcast" => "mic",
            "film" => "clapperboard",
            "game" => "gamepad-2",
            "entertainment" => "popcorn",
            _ => "shapes",
        };
}
