using System.Text.Json;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class FindingDetail
{
    [Parameter]
    public string Slug { get; set; } = string.Empty;
    private PublicFinding? Finding =>
        Snapshot?.Findings.FirstOrDefault(item =>
            PublicRouteKey.Matches(item.Url, item.Slug, Slug)
        );
    private string Eyebrow => L["legacy_f3b74f6bb3d7"];
    private string TypeEyebrow =>
        $"{TypeName(Finding?.Type)}{(string.IsNullOrWhiteSpace(Finding?.Rating) ? string.Empty : $" · {RatingName(Finding!.Rating)}")}";
    private string Title => Finding?.Title ?? Slug;
    private string Description => Finding?.Description ?? NotFoundDescription;
    private string CanonicalPath => Finding?.Url ?? RequestPath;
    private string LoadingTitle => L["legacy_74768c2a7c3e"];
    private string NotFoundTitle => L["legacy_ad1847844acd"];
    private string NotFoundDescription => L["legacy_4ace82508c7a"];
    private string FoundLabel => L["legacy_609679755e04"];
    private string StateLabel => L["legacy_cb3cee2bceb0"];
    private string TopicsLabel => L["legacy_4ab0be41630a"];
    private string CycleLabel => L["legacy_65c5f4ba61d0"];
    private string DetailsLabel => L["legacy_1904257596f9"];
    private string LinksLabel => L["legacy_5574d2f679a0"];
    private string ReasonLabel => L["legacy_0e9871d0ddf7"];
    private string PersonalNoteLabel => L["legacy_cda1689ba97c"];
    private string RelatedLabel => L["legacy_495726be1d55"];
    private string ConnectionsLabel => L["legacy_7cdaecf10f80"];
    private string FreeLabel => L["legacy_fb3c60675f35"];
    private string BackLabel => L["legacy_06852c4f5c74"];
    private static string IndexUrl => FeedUrls.ForKind(FeedUrls.Finding);
    private IReadOnlyList<PublicRelatedContent> RelatedFindings => Finding?.Related ?? [];
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(L["legacy_a2d8de463c5a"], IndexUrl)];
    private string ActionBody =>
        string.Join(
            "\n\n",
            new[]
            {
                string.IsNullOrWhiteSpace(Finding?.ReasonFound)
                    ? null
                    : $"## {ReasonLabel}\n\n{Finding.ReasonFound}",
                string.IsNullOrWhiteSpace(Finding?.PersonalNote)
                    ? null
                    : $"## {PersonalNoteLabel}\n\n{Finding.PersonalNote}",
            }.Where(value => !string.IsNullOrWhiteSpace(value))
        );

    private string TypeName(string? value) =>
        string.IsNullOrWhiteSpace(value)
            ? Eyebrow
            : value switch
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
                _ => value,
            };

    private string RatingName(string value) =>
        value switch
        {
            "interesting" => L["legacy_d45f7b3bf339"],
            "recommended" => L["legacy_831cadfbf680"],
            "strongly-recommended" => L["legacy_96f095c0f1f5"],
            "not-recommended" => L["legacy_5458bea30ae4"],
            "not-rated" => L["legacy_f3e1db84de77"],
            _ => value,
        };

    private string StateName(string value) =>
        value switch
        {
            "found" => L["legacy_c0747f9c453f"],
            "saved-for-later" => L["legacy_5ea83f883480"],
            "exploring" => L["legacy_fc4d4e95b75b"],
            "in-progress" => L["legacy_f9e603d208ea"],
            "completed" => L["legacy_69fad4c3aabf"],
            "abandoned" => L["legacy_40fa689d2b74"],
            "archived" => L["legacy_8432df564a5f"],
            _ => value,
        };

    private static string Humanize(string? value) =>
        string.IsNullOrWhiteSpace(value)
            ? "—"
            : ContentFactCatalog.LabelFor(value, CultureInfo.CurrentUICulture)
                ?? value.Replace('_', ' ');

    private static string DisplayValue(JsonElement value) =>
        value.ValueKind switch
        {
            JsonValueKind.String => value.GetString() ?? string.Empty,
            JsonValueKind.Null => string.Empty,
            _ => value.GetRawText(),
        };

    private static string? IconFor(string key) => ContentFactCatalog.IconFor(key);

    private static string LinkHost(string url) =>
        Uri.TryCreate(url, UriKind.Absolute, out var uri)
            ? uri.Host.StartsWith("www.", StringComparison.OrdinalIgnoreCase)
                ? uri.Host[4..]
                : uri.Host
            : url;

    private static string LinkIcon(PublicFindingLink link)
    {
        var key = $"{link.Platform} {LinkHost(link.Url)}".ToLowerInvariant();
        if (key.Contains("github") || key.Contains("gitlab"))
            return "code-branch";
        if (key.Contains("youtube") || key.Contains("vimeo"))
            return "youtube";
        if (key.Contains("arxiv") || key.Contains("doi.org"))
            return "file-text";
        if (key.Contains("wikipedia"))
            return "book-open";
        return link.Purpose?.ToLowerInvariant() switch
        {
            "repository" => "code-branch",
            "viewing" => "play",
            "reading" => "book-open",
            _ => "globe",
        };
    }

    private static bool IsSafeExternalUrl(string url) =>
        Uri.TryCreate(url, UriKind.Absolute, out var value)
        && (
            value.Scheme.Equals(Uri.UriSchemeHttp, StringComparison.OrdinalIgnoreCase)
            || value.Scheme.Equals(Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase)
        );

    private static string LocalizedUrl(string url) => LocalizedUrls.Current(url);
}
