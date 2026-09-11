using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Snippets
{
    private string Title => L["snippets"];
    private string Description => L["small_reusable_code_files_and_experiments"];
    private string LoadingLabel => L["loading_snippets"];
    private string EmptyLabel => L["no_snippets_available"];
    private string ResultsSummary => L["count_entries", SortedSnippets.Count];
    private static string CanonicalPath => LocalizedUrls.Current("/snippets");
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
    private string Sort => QuerySort is "asc" or "desc" or "alpha" ? QuerySort : string.Empty;
    private string _sortValue = string.Empty;
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
    private string ViewMode => QueryView is "dense" ? "dense" : "spacious";
    private bool DenseView => ViewMode == "dense";
    private IReadOnlyList<PublicSnippet> MatchingSnippets =>
        (Snapshot?.Snippets ?? [])
            .Where(item => MatchesSearch(QuerySearch, item.Title, item.Description))
            .ToArray();
    private IReadOnlyList<PublicSnippet> SortedSnippets =>
        Sort switch
        {
            "alpha" => MatchingSnippets
                .OrderBy(item => item.Title, StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            "asc" => MatchingSnippets.AsEnumerable().Reverse().ToArray(),
            _ => MatchingSnippets,
        };
    private const int PageSize = 20;
    private int PageCount => PageCountFor(SortedSnippets.Count, PageSize);
    private int CurrentPage => CurrentPageFor(QueryPage, PageCount);
    private IReadOnlyList<PublicSnippet> PagedSnippets =>
        ItemsForPage(SortedSnippets, CurrentPage, PageSize);

    protected override void OnParametersSet()
    {
        SortValue = Sort;
        _search = QuerySearch ?? string.Empty;
    }

    private string FileCount(PublicSnippet snippet)
    {
        var count = snippet.Files?.Count ?? 0;
        return L["count_files", count];
    }

    private static string FormatDate(string? value) =>
        DateTime.TryParse(value, out var date) ? date.ToString("yyyy-MM-dd") : "·";

    private string QueryUrl(string view, int page = 1) =>
        ListingUrl(Action, Sort, QuerySearch, view is "dense", page);

    private static string LocalizedUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var absolute))
            return url;
        var path = absolute.AbsolutePath;
        return LocalizedUrls.Current(path);
    }

    private string LocalizedPath(string path) =>
        path.Equals("home", StringComparison.OrdinalIgnoreCase)
            ? (L[""])
            : (LocalizedUrls.Current($"/{path}"));

    private string PageField(string field, string fallback)
    {
        if (
            Snapshot?.Pages.TryGetValue("snippets", out var page) != true
            || page.ValueKind != System.Text.Json.JsonValueKind.Object
            || !page.TryGetProperty(field, out var value)
        )
            return fallback;
        return value.GetString() ?? fallback;
    }
}
