using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Technologies
{
    private string Title => L["legacy_b4e2241909e0"];
    private string Description => L["legacy_c3e14f9552d3"];
    private string EmptyLabel => L["legacy_b705eec9e5a6"];
    private string ResultsSummary => L["count_entries", SortedTechnologies.Count];
    private string SeoTitle => PageField("technologies", "title", Title);
    private string SeoDescription => PageField("technologies", "description", Description);
    private static string CanonicalPath => LocalizedUrls.Current("/technologies");
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
    private string Sort => QuerySort is "asc" or "desc" or "alpha" or "order" ? QuerySort : "order";
    private string _sortValue = "order";
    private string SortValue
    {
        get => _sortValue;
        set => _sortValue = value is "asc" or "desc" or "alpha" or "order" ? value : "order";
    }
    private IReadOnlyList<SiteSelectOption> SortOptions =>
        [
            new("order", L["legacy_d878d9136e0e"]),
            new("desc", L["legacy_77c78d92c603"]),
            new("asc", L["legacy_07b165cdd970"]),
            new("alpha", L["legacy_cc8d79d78bef"]),
        ];
    private IReadOnlyList<PublicTechnology> MatchingTechnologies =>
        (Snapshot?.Technologies ?? [])
            .Where(item => MatchesSearch(QuerySearch, item.Name, item.Slug))
            .ToArray();
    private IReadOnlyList<PublicTechnology> SortedTechnologies =>
        Sort switch
        {
            "alpha" => MatchingTechnologies
                .OrderBy(item => item.Name, StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            "asc" => MatchingTechnologies.AsEnumerable().Reverse().ToArray(),
            _ => MatchingTechnologies,
        };
    private const int PageSize = 20;
    private int PageCount => PageCountFor(SortedTechnologies.Count, PageSize);
    private int CurrentPage => CurrentPageFor(QueryPage, PageCount);
    private IReadOnlyList<PublicTechnology> PagedTechnologies =>
        ItemsForPage(SortedTechnologies, CurrentPage, PageSize);
    private bool DenseView => string.Equals(QueryView, "dense", StringComparison.OrdinalIgnoreCase);
    private string ViewMode => DenseView ? "dense" : "spacious";

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
        {
            return fallback;
        }

        return value.GetString() ?? fallback;
    }

    private string LocalizedUrl(string? url) =>
        string.IsNullOrWhiteSpace(url) ? "#" : LocalizedPath(url);

    private string LocalizedPath(string url)
    {
        if (url.Equals("home", StringComparison.OrdinalIgnoreCase))
            return L["legacy_0607643fd42c"];
        if (!Uri.TryCreate(url, UriKind.Absolute, out var absolute))
            return url;
        var path = absolute.AbsolutePath;
        return LocalizedUrls.Current(path);
    }

    private string QueryUrl(int page) => QueryUrl(ViewMode, page);

    private string QueryUrl(string view, int page) =>
        ListingUrl(
            CanonicalPath,
            Sort,
            QuerySearch,
            view.Equals("dense", StringComparison.OrdinalIgnoreCase),
            page
        );
}
