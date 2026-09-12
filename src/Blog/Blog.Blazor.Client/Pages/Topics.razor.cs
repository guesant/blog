using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class Topics
{
    private string Title => L["topics"];
    private string Description => L["subjects_connecting_writing_and_references"];
    private string EmptyLabel => L["no_topics_available"];
    private string SeoTitle => PageField("topics", "title", Title);
    private string SeoDescription => PageField("topics", "description", Description);
    private static string CanonicalPath => LocalizedUrls.Current("/topics");
    private static string Action => CanonicalPath;

    [SupplyParameterFromQuery(Name = "sort")]
    private string? QuerySort { get; set; }

    [SupplyParameterFromQuery(Name = "view")]
    private string? QueryView { get; set; }

    [SupplyParameterFromQuery(Name = "page")]
    private int? QueryPage { get; set; }

    [SupplyParameterFromQuery(Name = "q")]
    private string? QuerySearch { get; set; }
    private string _search = string.Empty;
    private string Search
    {
        get => _search;
        set => _search = value;
    }
    private string _sortValue = string.Empty;
    private string Sort => QuerySort is "asc" or "desc" or "alpha" ? QuerySort : string.Empty;
    private string SortValue
    {
        get => _sortValue;
        set => _sortValue = value is "asc" or "desc" or "alpha" ? value : string.Empty;
    }
    private IReadOnlyList<SiteSelectOption> SortOptions =>
        [
            new("", L["sort"]),
            new("desc", L["default"]),
            new("asc", L["newest"]),
            new("alpha", L["alphabetical"]),
        ];
    private IReadOnlyList<PublicTopic> MatchingTopics =>
        (Snapshot?.Topics ?? [])
            .Where(item => MatchesSearch(QuerySearch, item.Name, item.Slug))
            .ToArray();
    private IReadOnlyList<PublicTopic> SortedTopics =>
        Sort switch
        {
            "alpha" => MatchingTopics
                .OrderBy(item => item.Name ?? item.Slug, StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            "asc" => MatchingTopics.AsEnumerable().Reverse().ToArray(),
            _ => MatchingTopics,
        };
    private const int PageSize = 20;
    private int PageCount => PageCountFor(SortedTopics.Count, PageSize);
    private int CurrentPage => CurrentPageFor(QueryPage, PageCount);
    private IReadOnlyList<PublicTopic> PagedTopics =>
        ItemsForPage(SortedTopics, CurrentPage, PageSize);
    private string ResultsSummary => L["count_entries", SortedTopics.Count];

    protected override void OnParametersSet()
    {
        _sortValue = Sort;
        _search = QuerySearch ?? string.Empty;
    }

    private string ViewMode => QueryView is "dense" ? "dense" : "spacious";
    private bool DenseView => ViewMode == "dense";

    private string QueryUrl(string view, int page = 1) =>
        ListingUrl(Action, Sort, QuerySearch, view == "dense", page);

    private string PageField(string page, string field, string fallback)
    {
        if (
            Snapshot?.Pages.TryGetValue(page, out var fields) != true
            || fields.ValueKind != System.Text.Json.JsonValueKind.Object
            || !fields.TryGetProperty(field, out var value)
        )
        {
            return fallback;
        }

        return value.GetString() ?? fallback;
    }

    private static string LocalizedUrl(string? url) =>
        string.IsNullOrWhiteSpace(url) ? "#" : LocalizedPath(url);

    private static string LocalizedPath(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var absolute))
            return url;
        var path = absolute.AbsolutePath;
        return LocalizedUrls.Current(path);
    }

    private static string LocalizedRoute(string path) => LocalizedUrls.Current($"/{path}");

    private static IReadOnlyList<BreadcrumbLink> BreadcrumbLinks => [];
}
