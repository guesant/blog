using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Cases
{
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
    private static string Action => LocalizedUrls.Current("/cases");
    private static string CanonicalPath => Action;
    private string Title => L["legacy_867acccc0ae7"];
    private string FallbackDescription => L["legacy_7e516bb522ce"];
    private string EmptyLabel => L["legacy_325451caac6b"];
    private string UnavailableLabel => L["legacy_fa8c57ffb24f"];
    private string SeoTitle => PageField("cases", "title", Title);
    private string SeoDescription => PageField("cases", "description", FallbackDescription);
    private string Sort => QuerySort is "asc" or "alpha" ? QuerySort : "desc";
    private string _sortValue = "desc";
    private string SortValue
    {
        get => _sortValue;
        set => _sortValue = value is "asc" or "alpha" or "desc" ? value : "desc";
    }
    private IReadOnlyList<SiteSelectOption> SortOptions =>
        [new("desc", L["newest"]), new("asc", L["oldest"]), new("alpha", L["alphabetical"])];
    private bool DenseView => string.Equals(QueryView, "dense", StringComparison.OrdinalIgnoreCase);
    private string ViewMode => DenseView ? "dense" : "spacious";
    private const int PageSize = 20;

    private IReadOnlyList<PublicCaseStudy> SortedCases =>
        (Snapshot?.Cases ?? [])
            .Where(item => MatchesSearch(QuerySearch, item.Title, item.Summary))
            .OrderByDescending(item =>
                Sort.Equals("desc", StringComparison.OrdinalIgnoreCase)
                    ? item.PublishedAt ?? string.Empty
                    : string.Empty
            )
            .ThenBy(
                item =>
                    Sort.Equals("alpha", StringComparison.OrdinalIgnoreCase)
                        ? item.Title
                        : string.Empty,
                StringComparer.OrdinalIgnoreCase
            )
            .ThenBy(item =>
                Sort.Equals("asc", StringComparison.OrdinalIgnoreCase)
                    ? item.PublishedAt ?? string.Empty
                    : string.Empty
            )
            .ToArray();

    private int PageCount => PageCountFor(SortedCases.Count, PageSize);
    private int CurrentPage => CurrentPageFor(QueryPage, PageCount);
    private IReadOnlyList<PublicCaseStudy> PagedCases =>
        ItemsForPage(SortedCases, CurrentPage, PageSize);

    private static string FormatDate(string? value) =>
        DateTime.TryParse(value, out var date) ? date.ToString("yyyy-MM-dd") : "·";

    private string ResultsSummary => L["count_cases", SortedCases.Count];

    private static string LocalizedTechnologyUrl(PublicTechnology technology) =>
        LocalizedUrls.Current($"/technologies/{technology.Slug}");

    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(L["legacy_0d5377122054"], LocalizedPath("portfolio"))];

    protected override void OnParametersSet()
    {
        SortValue = Sort;
        _search = QuerySearch ?? string.Empty;
    }

    private string PageField(string page, string field, string fallback)
    {
        if (
            Snapshot?.Pages.TryGetValue(page, out var fields) != true
            || fields.ValueKind != System.Text.Json.JsonValueKind.Object
            || !fields.TryGetProperty(field, out var value)
        )
            return fallback;
        return value.GetString() ?? fallback;
    }

    private string QueryUrl(string view, int page = 1) =>
        ListingUrl(
            Action,
            Sort,
            QuerySearch,
            view.Equals("dense", StringComparison.OrdinalIgnoreCase),
            page
        );

    private static string LocalizedPath(string path) => LocalizedUrls.Current($"/{path}");

    private static string LocalizedUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var absolute))
            return url;
        var path = absolute.AbsolutePath;
        return LocalizedUrls.Current(path);
    }
}
