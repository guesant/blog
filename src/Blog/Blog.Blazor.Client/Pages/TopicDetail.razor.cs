using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class TopicDetail
{
    [Parameter]
    public string Slug { get; set; } = string.Empty;
    private PublicTopic? Topic =>
        Snapshot?.Topics.FirstOrDefault(item => PublicRouteKey.Matches(item.Url, item.Slug, Slug));
    private IReadOnlyList<PublicWriting> Writings =>
        Snapshot
            ?.Writings.Where(item =>
                item.Topics?.Any(value =>
                    value.Slug.Equals(ResolvedSlug, StringComparison.OrdinalIgnoreCase)
                ) == true
            )
            .ToArray()
        ?? [];
    private IReadOnlyList<PublicFinding> Findings =>
        Snapshot
            ?.Findings.Where(item =>
                item.Topics?.Any(value =>
                    value.Slug.Equals(ResolvedSlug, StringComparison.OrdinalIgnoreCase)
                ) == true
            )
            .ToArray()
        ?? [];
    private string ResolvedSlug => Topic?.Slug ?? Slug;
    private string Title => Topic?.Name ?? Slug;
    private string Description => L["browse_topic", Title];
    private string CanonicalPath => Topic?.Url ?? RequestPath;
    private string LoadingLabel => L["loading_topic"];
    private string EmptyLabel => L["no_topic_found"];
    private string NotFoundLabel => L["no_findings_are_currently_published_here"];
    private string NotFoundDescription => L["topic_not_found"];
    private string BackLabel => L["this_address_does_not_match_a_public_topic"];
    private string IndexUrl => LocalizedPath("topics");
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(CrumbLabel("topics", L["topics"]), IndexUrl)];

    private string WritingKind(string? type) =>
        type?.ToLowerInvariant() switch
        {
            "article" => L["article"],
            "note" => L["note"],
            "project-diary" => L["project_diary"],
            _ => string.IsNullOrWhiteSpace(type) ? L["project_diary"] : type.Replace('-', ' '),
        };

    private string FindingKind(string? type) =>
        type?.ToLowerInvariant() switch
        {
            "book" => L["book"],
            "article" => L["article"],
            "paper" => "paper",
            "repo" => L["repository"],
            "site" => L["site"],
            "docs" => L["documentation"],
            "tool" => L["tool"],
            "course" => L["course"],
            "video" => L["video"],
            "playlist" => "playlist",
            "channel" => L["channel"],
            "podcast" => "podcast",
            "film" => L["film"],
            "other" => L["other"],
            _ => string.IsNullOrWhiteSpace(type) ? (L["finding"]) : type,
        };

    private string RatingName(string? value) =>
        value?.ToLowerInvariant() switch
        {
            "interesting" => L["interesting"],
            "recommended" => L["recommended"],
            "strongly-recommended" => L["strongly_recommended"],
            "not-recommended" => L["not_recommended"],
            _ => string.Empty,
        };

    private static string FormatDate(string? value) =>
        DateTime.TryParse(value, out var date)
            ? date.ToString("dd MMM yyyy", CultureInfo.CurrentCulture)
            : "";

    private string LocalizedPath(string path) =>
        path.Equals("home", StringComparison.OrdinalIgnoreCase)
            ? (L[""])
            : (LocalizedUrls.Current($"/{path}"));

    private static string LocalizedUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var absolute))
            return url;
        var path = absolute.AbsolutePath;
        return LocalizedUrls.Current(path);
    }
}
