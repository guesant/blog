using System.Text.Json;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class ContentDetail
{
    [Parameter]
    public string Slug { get; set; } = string.Empty;
    private bool IsCase => RequestPath.Contains("/cases/", StringComparison.OrdinalIgnoreCase);
    private bool IsWriting => RequestPath.Contains("/writing/", StringComparison.OrdinalIgnoreCase);
    private bool IsProject => !IsCase && !IsWriting;
    private PublicProject? Project =>
        IsProject
            ? Snapshot?.Projects.FirstOrDefault(item =>
                PublicRouteKey.Matches(item.Url, item.Slug, Slug)
            )
            : null;
    private PublicCaseStudy? CaseStudy =>
        IsCase
            ? Snapshot?.Cases.FirstOrDefault(item =>
                PublicRouteKey.Matches(item.Url, item.Slug, Slug)
            )
            : null;
    private PublicWriting? Writing =>
        IsWriting
            ? Snapshot?.Writings.FirstOrDefault(item =>
                PublicRouteKey.Matches(item.Url, item.Slug, Slug)
            )
            : null;
    private object? CurrentContent => Project ?? (object?)CaseStudy ?? Writing;
    private bool ShowHistory =>
        Project?.ShowHistory == true
        || CaseStudy?.ShowHistory == true
        || Writing?.ShowHistory == true;
    private IReadOnlyList<PublicHistoryEntry>? History =>
        Project?.History ?? CaseStudy?.History ?? Writing?.History;
    private IReadOnlyList<PublicRelatedContent>? Related =>
        Project?.Related ?? CaseStudy?.Related ?? Writing?.Related;
    private string KindLabel =>
        IsCase ? (L["legacy_3dc269cea284"])
        : IsWriting ? (L["legacy_ebede9852c81"])
        : (L["legacy_2c505faad45c"]);
    private string Title =>
        Project?.Name ?? CaseStudy?.Title ?? Writing?.Title ?? Slug.Replace('-', ' ');
    private string Description =>
        Project?.Purpose ?? CaseStudy?.Summary ?? Writing?.Excerpt ?? NotFoundDescription;
    private string Body => Project?.Body ?? CaseStudy?.Body ?? Writing?.Body ?? string.Empty;
    private string? ExternalHref => Project?.Href ?? CaseStudy?.Href;
    private string ReadingTime => Writing?.ReadingTime ?? string.Empty;
    private string CanonicalPath => Project?.Url ?? CaseStudy?.Url ?? Writing?.Url ?? RequestPath;
    private string? PublishedTime =>
        Project?.PublishedAt ?? CaseStudy?.PublishedAt ?? Writing?.Date;
    private string? UpdatedTime => Project?.UpdatedAt ?? CaseStudy?.UpdatedAt ?? Writing?.UpdatedAt;
    private string DetailIndexUrl =>
        IsCase ? LocalizedPath("cases")
        : IsProject ? LocalizedPath("projects")
        : FeedUrls.ForKind(FeedUrls.Writing);
    private string DetailIndexLabel =>
        IsCase ? (L["legacy_3dc269cea284"])
        : IsProject ? (L["legacy_2c505faad45c"])
        : (L["legacy_ebede9852c81"]);
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        IsCase
            ?
            [
                new(L["legacy_5c816876b410"], LocalizedPath("portfolio")),
                new(L["legacy_3dc269cea284"], LocalizedPath("cases")),
            ]
        : IsProject
            ?
            [
                new(L["legacy_5c816876b410"], LocalizedPath("portfolio")),
                new(L["legacy_2c505faad45c"], LocalizedPath("projects")),
            ]
        : [new(L["legacy_ebede9852c81"], FeedUrls.ForKind(FeedUrls.Writing))];
    private string LoadingTitle => L["legacy_d6a275b8ae9c"];
    private string NotFoundTitle => L["legacy_44d5d0470edb"];
    private string NotFoundDescription => L["legacy_6913e54f5c0f"];
    private IReadOnlyList<PublicTechnology> TechnologyLinks =>
        Project?.Technologies ?? CaseStudy?.Technologies ?? [];
    private IReadOnlyList<PublicTechnology> TopicLinks => IsWriting ? Writing?.Topics ?? [] : [];
    private string? WritingType => string.IsNullOrWhiteSpace(Writing?.Type) ? null : Writing!.Type;
    private string? WritingTopic =>
        Writing?.Topics?.FirstOrDefault()?.Name ?? Writing?.Topics?.FirstOrDefault()?.Slug;
    private IReadOnlyList<(string Key, string Label, string Value)> Facts =>
        IsCase
            ? new (string Key, string Label, string? Value)[]
            {
                ("context", L["legacy_c6cf358abb20"].Value, CaseStudy?.Context),
                ("role", L["legacy_7bc2a8b13e9e"].Value, CaseStudy?.Role),
                ("outcome", L["legacy_dfea58cad5c4"].Value, CaseStudy?.Result),
            }
                .Where(item => !string.IsNullOrWhiteSpace(item.Value))
                .Select(item => (item.Key, item.Label, item.Value!))
                .ToArray()
        : IsProject
            ? new (string Key, string Label, string? Value)[]
            {
                ("problem", L["legacy_1c5ab9596d6b"].Value, Project?.Problem),
                ("current-focus", L["legacy_a7c989edbc53"].Value, Project?.CurrentFocus),
            }
                .Where(item => !string.IsNullOrWhiteSpace(item.Value))
                .Select(item => (item.Key, item.Label, item.Value!))
                .ToArray()
        : [];
    private IReadOnlyList<(string Label, string Value)> Metrics =>
        MetricValues(Project?.Metrics ?? CaseStudy?.Metrics);

    private static string? IconFor(string key) => ContentFactCatalog.IconFor(key);

    private static IReadOnlyList<(string Label, string Value)> MetricValues(JsonElement? metrics)
    {
        if (metrics is not { ValueKind: JsonValueKind.Object or JsonValueKind.Array })
            return [];
        if (metrics.Value.ValueKind == JsonValueKind.Array)
        {
            return metrics
                .Value.EnumerateArray()
                .Where(item => item.ValueKind == JsonValueKind.Object)
                .Select(item => (StringValue(item, "label"), StringValue(item, "value")))
                .Where(item =>
                    !string.IsNullOrWhiteSpace(item.Item1) || !string.IsNullOrWhiteSpace(item.Item2)
                )
                .ToArray();
        }
        return metrics
            .Value.EnumerateObject()
            .Select(item =>
                (
                    item.Name,
                    item.Value.ValueKind == JsonValueKind.String
                        ? item.Value.GetString() ?? string.Empty
                        : item.Value.ToString()
                )
            )
            .Where(item => !string.IsNullOrWhiteSpace(item.Item2))
            .ToArray();
    }

    private static string LocalizedPath(string path) => LocalizedUrls.Current($"/{path}");

    private static string StringValue(JsonElement value, string key) =>
        value.TryGetProperty(key, out var field) && field.ValueKind == JsonValueKind.String
            ? field.GetString() ?? string.Empty
            : string.Empty;

    private static string JoinMeta(params string?[] values) =>
        string.Join(" · ", values.Where(value => !string.IsNullOrWhiteSpace(value)));

    private bool ShouldShowUpdated =>
        !string.IsNullOrWhiteSpace(PublishedTime)
        && !string.IsNullOrWhiteSpace(UpdatedTime)
        && DateTime.TryParse(PublishedTime, out var published)
        && DateTime.TryParse(UpdatedTime, out var updated)
        && (updated - published).TotalHours > 24;

    private static string FormatHumanDate(string? value) =>
        DateTime.TryParse(value, out var date)
            ? date.ToString("dd MMM yyyy", CultureInfo.CurrentCulture)
            : value ?? string.Empty;
}
