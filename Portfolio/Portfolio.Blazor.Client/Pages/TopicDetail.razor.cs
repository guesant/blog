using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
    private string LoadingLabel => L["legacy_aabc9aac22e5"];
    private string EmptyLabel => L["legacy_1956fff977af"];
    private string NotFoundLabel => L["legacy_1b967d853961"];
    private string NotFoundDescription => L["legacy_07773aaef25f"];
    private string BackLabel => L["legacy_10fac44159a7"];
    private string IndexUrl => LocalizedPath("topics");
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(L["legacy_4ab0be41630a"], IndexUrl)];

    private string WritingKind(string? type) =>
        type?.ToLowerInvariant() switch
        {
            "article" => L["legacy_8a7b563164e6"],
            "note" => L["legacy_9b08c0838f59"],
            "project-diary" => L["legacy_36f879809607"],
            _ => string.IsNullOrWhiteSpace(type)
                ? L["legacy_36f879809607"]
                : type.Replace('-', ' '),
        };

    private string FindingKind(string? type) =>
        type?.ToLowerInvariant() switch
        {
            "book" => L["legacy_f64f90d110a7"],
            "article" => L["legacy_8a7b563164e6"],
            "paper" => "paper",
            "repo" => L["legacy_3f6ede9e4d29"],
            "site" => L["legacy_40bd62db98af"],
            "docs" => L["legacy_9e5e2519972c"],
            "tool" => L["legacy_c1ce4f438b8b"],
            "course" => L["legacy_7101bea24f0f"],
            "video" => L["legacy_1da31972a3bc"],
            "playlist" => "playlist",
            "channel" => L["legacy_806b1ac02287"],
            "podcast" => "podcast",
            "film" => L["legacy_6df5e95d416e"],
            "other" => L["legacy_f44ac71ffd29"],
            _ => string.IsNullOrWhiteSpace(type) ? (L["legacy_f3b74f6bb3d7"]) : type,
        };

    private string RatingName(string? value) =>
        value?.ToLowerInvariant() switch
        {
            "interesting" => L["legacy_d45f7b3bf339"],
            "recommended" => L["legacy_831cadfbf680"],
            "strongly-recommended" => L["legacy_96f095c0f1f5"],
            "not-recommended" => L["legacy_5458bea30ae4"],
            _ => string.Empty,
        };

    private static string FormatDate(string? value) =>
        DateTime.TryParse(value, out var date)
            ? date.ToString("dd MMM yyyy", CultureInfo.CurrentCulture)
            : "";

    private string LocalizedPath(string path) =>
        path.Equals("home", StringComparison.OrdinalIgnoreCase)
            ? (L["legacy_0607643fd42c"])
            : (LocalizedUrls.Current($"/{path}"));

    private static string LocalizedUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var absolute))
            return url;
        var path = absolute.AbsolutePath;
        return LocalizedUrls.Current(path);
    }
}
