using Blog.Blazor.Client.Shared;
using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class TopicDetail
{
    private const int MaxAncestorDepth = 8;
    private const int PageSize = 20;

    [Parameter]
    public string Slug { get; set; } = string.Empty;

    [SupplyParameterFromQuery(Name = "sort")]
    private string? QuerySort { get; set; }

    [SupplyParameterFromQuery(Name = "type")]
    private string? QueryType { get; set; }

    [SupplyParameterFromQuery(Name = "q")]
    private string? QuerySearch { get; set; }

    [SupplyParameterFromQuery(Name = "page")]
    private int? QueryPage { get; set; }

    private string _sortValue = "featured";
    private string _typeValue = string.Empty;
    private string PendingSearch { get; set; } = string.Empty;

    private string ActiveSort =>
        QuerySort is "featured" or "popular" or "newest" or "alpha" ? QuerySort : "featured";
    private string ActiveType =>
        FindingTypeCatalog.Types.Contains(QueryType, StringComparer.OrdinalIgnoreCase)
            ? QueryType!.Trim()
            : string.Empty;
    private string ActiveSearch => QuerySearch?.Trim() ?? string.Empty;

    private string SortValue
    {
        get => _sortValue;
        set =>
            _sortValue = value is "featured" or "popular" or "newest" or "alpha"
                ? value
                : "featured";
    }
    private string TypeValue
    {
        get => _typeValue;
        set =>
            _typeValue = FindingTypeCatalog.Types.Contains(value, StringComparer.OrdinalIgnoreCase)
                ? value
                : string.Empty;
    }

    private IReadOnlyList<SiteSelectOption> SortSelectOptions =>
        [
            new("featured", L["featured"], "star"),
            new("popular", L["most_popular"], "flame"),
            new("newest", L["newest"], "arrow-down-wide-narrow"),
            new("alpha", L["alphabetical"], "arrow-down-a-z"),
        ];

    private IReadOnlyList<SiteSelectOption> TypeSelectOptions =>
        FindingTypeCatalog
            .Types.Select(type => new SiteSelectOption(type, FindingKind(type)))
            .Prepend(new SiteSelectOption("", L["all"]))
            .ToArray();

    private IReadOnlyList<PublicFinding> FilteredFindings =>
        SubtreeFindings
            .Where(item =>
                string.IsNullOrWhiteSpace(ActiveType)
                || (item.Type ?? string.Empty).Equals(
                    ActiveType,
                    StringComparison.OrdinalIgnoreCase
                )
            )
            .Where(item =>
                string.IsNullOrWhiteSpace(ActiveSearch)
                || (item.Title ?? item.Slug).Contains(
                    ActiveSearch,
                    StringComparison.OrdinalIgnoreCase
                )
                || (item.Description ?? string.Empty).Contains(
                    ActiveSearch,
                    StringComparison.OrdinalIgnoreCase
                )
            )
            .ToArray();

    private IReadOnlyList<PublicFinding> SortedFindings =>
        ActiveSort switch
        {
            "popular" => FilteredFindings
                .OrderBy(item => item.Popularity is null ? 1 : 0)
                .ThenByDescending(item => item.Popularity?.Rank)
                .ThenByDescending(item => item.PublishedDate, StringComparer.Ordinal)
                .ToArray(),
            "newest" => FilteredFindings
                .OrderByDescending(item => item.PublishedDate, StringComparer.Ordinal)
                .ToArray(),
            "alpha" => FilteredFindings
                .OrderBy(item => item.Title ?? item.Slug, StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            _ => FilteredFindings
                .OrderBy(item => item.Featured ? 0 : 1)
                .ThenBy(item => item.FeaturedOrder ?? int.MaxValue)
                .ThenByDescending(item => item.PublishedDate, StringComparer.Ordinal)
                .ToArray(),
        };

    private int PageCount => PageCountFor(SortedFindings.Count, PageSize);
    private int CurrentPage => CurrentPageFor(QueryPage, PageCount);
    private IReadOnlyList<PublicFinding> PagedFindings =>
        ItemsForPage(SortedFindings, CurrentPage, PageSize);

    private string QueryUrl(int page)
    {
        var query = new List<string>();
        if (!ActiveSort.Equals("featured", StringComparison.OrdinalIgnoreCase))
            query.Add($"sort={Uri.EscapeDataString(ActiveSort)}");
        if (!string.IsNullOrWhiteSpace(ActiveType))
            query.Add($"type={Uri.EscapeDataString(ActiveType)}");
        if (!string.IsNullOrWhiteSpace(ActiveSearch))
            query.Add($"q={Uri.EscapeDataString(ActiveSearch)}");
        if (page > 1)
            query.Add($"page={page}");
        return CanonicalPath + (query.Count > 0 ? "?" + string.Join('&', query) : string.Empty);
    }

    private void HandleApply()
    {
        var query = new List<string>();
        if (!SortValue.Equals("featured", StringComparison.OrdinalIgnoreCase))
            query.Add($"sort={Uri.EscapeDataString(SortValue)}");
        if (!string.IsNullOrWhiteSpace(TypeValue))
            query.Add($"type={Uri.EscapeDataString(TypeValue)}");
        if (!string.IsNullOrWhiteSpace(PendingSearch))
            query.Add($"q={Uri.EscapeDataString(PendingSearch)}");
        var url = CanonicalPath + (query.Count > 0 ? "?" + string.Join('&', query) : string.Empty);
        Navigation.NavigateTo(url);
    }

    private PublicTopic? Topic =>
        Snapshot?.Topics.FirstOrDefault(item => PublicRouteKey.Matches(item.Url, item.Slug, Slug));
    protected override bool IsNotFound => Topic is null;

    private PublicSiteSnapshot? _descendantsSnapshot;
    private IReadOnlyList<string> _descendantNames = [];
    private IReadOnlyList<string> DescendantSlugSet
    {
        get
        {
            if (!ReferenceEquals(_descendantsSnapshot, Snapshot))
            {
                _descendantsSnapshot = Snapshot;
                _descendantNames = TopicTree.SubtreeSlugs(Snapshot?.Topics, ResolvedSlug);
            }
            return _descendantNames;
        }
    }

    private IReadOnlyList<PublicTopic> Subcategories => Topic?.Children ?? [];

    private IReadOnlyList<PublicWriting> Writings =>
        Snapshot
            ?.Writings.Where(item =>
                item.Topics?.Any(value => DescendantSlugSet.Contains(value.Slug)) == true
            )
            .ToArray()
        ?? [];
    private IReadOnlyList<PublicFinding> SubtreeFindings =>
        Snapshot
            ?.Findings.Where(item =>
                item.Topics?.Any(value => DescendantSlugSet.Contains(value.Slug)) == true
            )
            .ToArray()
        ?? [];
    private IReadOnlyList<PublicFinding> HighlightFindings =>
        SubtreeFindings
            .Where(item => item.Featured)
            .OrderBy(item => item.FeaturedOrder ?? int.MaxValue)
            .ThenByDescending(item => item.PublishedDate, StringComparer.Ordinal)
            .Take(6)
            .ToArray();
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
    private string HighlightsLabel => L["highlights"];
    private string SubcategoriesLabel => L["subcategories"];
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [
            new(CrumbLabel("topics", L["topics"]), IndexUrl),
            .. TopicTree
                .Ancestors(Snapshot?.Topics, Topic, MaxAncestorDepth)
                .Select(item => new BreadcrumbLink(
                    item.Name ?? item.Slug,
                    LocalizedUrl(item.Url ?? $"/topics/{item.Slug}")
                )),
        ];

    private int SubtreeFindingCount(PublicTopic topic) =>
        Snapshot?.Findings.Count(item =>
            item.Topics?.Any(value =>
                TopicTree.SubtreeSlugs(Snapshot?.Topics, topic.Slug).Contains(value.Slug)
            ) == true
        )
        ?? 0;

    private string WritingKind(string? type) =>
        type?.ToLowerInvariant() switch
        {
            "article" => L["article"],
            "note" => L["note"],
            "project-diary" => L["project_diary"],
            _ => string.IsNullOrWhiteSpace(type) ? L["project_diary"] : type.Replace('-', ' '),
        };

    private string FindingKind(string? type) => FindingTypeCatalog.Label(type, L);

    private string? PopularityLabel(PublicFinding item) =>
        PopularityFormat.Label(item.Popularity, L);

    protected override void OnParametersSet()
    {
        _sortValue = ActiveSort;
        _typeValue = ActiveType;
        PendingSearch = ActiveSearch;
    }

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
