using System.Text.Json;
using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class FindingDetail
{
    [Parameter]
    public string Slug { get; set; } = string.Empty;
    private PublicFinding? Finding =>
        Snapshot?.Findings.FirstOrDefault(item =>
            PublicRouteKey.Matches(item.Url, item.Slug, Slug)
        );
    private string Eyebrow => L["finding"];
    private string TypeEyebrow =>
        $"{TypeName(Finding?.Type)}{(string.IsNullOrWhiteSpace(Finding?.Rating) ? string.Empty : $" · {RatingName(Finding!.Rating)}")}";
    private string Title => Finding?.Title ?? Slug;
    private string Description => Finding?.Description ?? NotFoundDescription;
    private string CanonicalPath => Finding?.Url ?? RequestPath;
    private string LoadingTitle => L["loading_finding"];
    private string NotFoundTitle => L["finding_not_found"];
    private string NotFoundDescription => L["this_address_does_not_match_a_public_finding"];
    private string FoundLabel => L["found_on"];
    private string StateLabel => L["state"];
    private string TopicsLabel => L["topics"];
    private string CycleLabel => L["cycle"];
    private string DetailsLabel => L["details"];
    private string LinksLabel => L["links"];
    private string ReasonLabel => L["why_it_was_saved"];
    private string PersonalNoteLabel => L["personal_note"];
    private string RelatedLabel => L["related_content"];
    private string ConnectionsLabel => L["connections_and_related_content"];
    private string FreeLabel => L["free"];
    private string BackLabel => L["back_to_findings"];
    private static string IndexUrl => FeedUrls.ForKind(FeedUrls.Finding);
    private IReadOnlyList<PublicRelatedContent> RelatedFindings => Finding?.Related ?? [];
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(CrumbLabel("findings", L["findings"]), IndexUrl)];
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
                _ => value,
            };

    private string RatingName(string value) =>
        value switch
        {
            "interesting" => L["interesting"],
            "recommended" => L["recommended"],
            "strongly-recommended" => L["strongly_recommended"],
            "not-recommended" => L["not_recommended"],
            "not-rated" => L["not_rated"],
            _ => value,
        };

    private string StateName(string value) =>
        value switch
        {
            "found" => L["found"],
            "saved-for-later" => L["saved_for_later"],
            "exploring" => L["exploring"],
            "in-progress" => L["in_progress"],
            "completed" => L["completed"],
            "abandoned" => L["abandoned"],
            "archived" => L["arquivado"],
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
