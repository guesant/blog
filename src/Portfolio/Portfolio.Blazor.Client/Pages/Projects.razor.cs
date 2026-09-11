using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Projects
{
    [SupplyParameterFromQuery(Name = "sort")]
    private string? QuerySort { get; set; }

    [SupplyParameterFromQuery(Name = "sort_experiments")]
    private string? QueryExperimentSort { get; set; }

    [SupplyParameterFromQuery(Name = "view")]
    private string? QueryView { get; set; }

    [SupplyParameterFromQuery(Name = "view_experiments")]
    private string? QueryExperimentView { get; set; }

    [SupplyParameterFromQuery(Name = "page")]
    private int? QueryPage { get; set; }

    [SupplyParameterFromQuery(Name = "experiment_page")]
    private int? QueryExperimentPage { get; set; }

    [SupplyParameterFromQuery(Name = "q")]
    private string? QuerySearch { get; set; }

    [SupplyParameterFromQuery(Name = "q_experiments")]
    private string? QueryExperimentSearch { get; set; }
    private string _search = string.Empty;
    private string Search
    {
        get => _search;
        set => _search = value;
    }
    private string _experimentSearch = string.Empty;
    private string ExperimentSearch
    {
        get => _experimentSearch;
        set => _experimentSearch = value;
    }
    private static string Action => LocalizedUrls.Current("/projects");
    private static string CanonicalPath => Action;
    private string Title => L["projects_and_lab"];
    private string FallbackDescription => L["public_archive_of_software_libraries_and"];
    private string EmptyLabel => L["no_projects_available"];
    private string UnavailableLabel => L["public_content_is_temporarily_unavailable"];
    private string SeoTitle => PageField("projects", "title", Title);
    private string SeoDescription => PageField("projects", "description", FallbackDescription);
    private string Sort => QuerySort is "asc" or "alpha" ? QuerySort : "desc";
    private string _sortValue = "desc";
    private string SortValue
    {
        get => _sortValue;
        set => _sortValue = value is "asc" or "alpha" or "desc" ? value : "desc";
    }
    private string ExperimentSort =>
        QueryExperimentSort is "asc" or "alpha" ? QueryExperimentSort : "desc";
    private string _experimentSortValue = "desc";
    private string ExperimentSortValue
    {
        get => _experimentSortValue;
        set => _experimentSortValue = value is "asc" or "alpha" or "desc" ? value : "desc";
    }
    private IReadOnlyList<SiteSelectOption> SortOptions =>
        [new("desc", L["default"]), new("asc", L["newest"]), new("alpha", L["alphabetical"])];
    private bool DenseView => string.Equals(QueryView, "dense", StringComparison.OrdinalIgnoreCase);
    private bool ExperimentDenseView =>
        string.Equals(QueryExperimentView, "dense", StringComparison.OrdinalIgnoreCase);
    private const int PageSize = 20;
    private const int ExperimentPageSize = 12;

    private IReadOnlyList<PublicProject> SortedProjects =>
        (Snapshot?.Projects ?? [])
            .Where(item => MatchesSearch(QuerySearch, item.Name, item.Purpose, item.Problem))
            .OrderByDescending(item =>
                Sort.Equals("desc", StringComparison.OrdinalIgnoreCase)
                    ? item.PublishedAt ?? string.Empty
                    : string.Empty
            )
            .ThenBy(
                item =>
                    Sort.Equals("alpha", StringComparison.OrdinalIgnoreCase)
                        ? item.Name
                        : string.Empty,
                StringComparer.OrdinalIgnoreCase
            )
            .ThenBy(item =>
                Sort.Equals("asc", StringComparison.OrdinalIgnoreCase)
                    ? item.PublishedAt ?? string.Empty
                    : string.Empty
            )
            .ToArray();

    private int PageCount => PageCountFor(SortedProjects.Count, PageSize);
    private int CurrentPage => CurrentPageFor(QueryPage, PageCount);
    private IReadOnlyList<PublicProject> PagedProjects =>
        ItemsForPage(SortedProjects, CurrentPage, PageSize);
    private IReadOnlyList<PublicExperiment> SortedExperiments =>
        (Snapshot?.Experiments ?? [])
            .Where(item => MatchesSearch(QueryExperimentSearch, item.Name, item.Purpose))
            .OrderByDescending(item =>
                ExperimentSort.Equals("desc", StringComparison.OrdinalIgnoreCase)
                    ? item.PublishedAt ?? string.Empty
                    : string.Empty
            )
            .ThenBy(
                item =>
                    ExperimentSort.Equals("alpha", StringComparison.OrdinalIgnoreCase)
                        ? item.Name
                        : string.Empty,
                StringComparer.OrdinalIgnoreCase
            )
            .ThenBy(item =>
                ExperimentSort.Equals("asc", StringComparison.OrdinalIgnoreCase)
                    ? item.PublishedAt ?? string.Empty
                    : string.Empty
            )
            .ToArray();
    private int ExperimentPageCount => PageCountFor(SortedExperiments.Count, ExperimentPageSize);
    private int ExperimentCurrentPage => CurrentPageFor(QueryExperimentPage, ExperimentPageCount);
    private IReadOnlyList<PublicExperiment> PagedExperiments =>
        ItemsForPage(SortedExperiments, ExperimentCurrentPage, ExperimentPageSize);

    private static string FormatDate(string? value) =>
        DateTime.TryParse(value, out var date) ? date.ToString("yyyy-MM-dd") : "·";

    private static string LocalizedTechnologyUrl(PublicTechnology technology) =>
        LocalizedUrls.Current($"/technologies/{technology.Slug}");

    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(CrumbLabel("portfolio", L["portfolio"]), LocalizedPath("portfolio"))];

    protected override void OnParametersSet()
    {
        SortValue = Sort;
        ExperimentSortValue = ExperimentSort;
        _search = QuerySearch ?? string.Empty;
        _experimentSearch = QueryExperimentSearch ?? string.Empty;
    }

    private void HandleExperimentApply() =>
        Navigation.NavigateTo(
            ExperimentUrl(ExperimentSortValue, ExperimentSearch, ExperimentViewMode, 1)
        );

    private string ExperimentUrl(string sort, string? search, string view, int page)
    {
        var url =
            ListingUrl(Action, Sort, QuerySearch, DenseView, 1)
            + $"&sort_experiments={Uri.EscapeDataString(sort)}"
            + $"&view_experiments={(view.Equals("dense", StringComparison.OrdinalIgnoreCase) ? "dense" : "spacious")}";
        if (!string.IsNullOrWhiteSpace(search))
            url += $"&q_experiments={Uri.EscapeDataString(search.Trim())}";
        if (page > 1)
            url += $"&experiment_page={page}";
        return url;
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

    private static string ResultsSummary(int count, string label) => $"{count} {label}";

    private string ViewMode => DenseView ? "dense" : "spacious";

    private string QueryUrl(string view, int page = 1) =>
        ListingUrl(
            Action,
            Sort,
            QuerySearch,
            view.Equals("dense", StringComparison.OrdinalIgnoreCase),
            page
        );

    private string ExperimentViewMode => ExperimentDenseView ? "dense" : "spacious";

    private string ExperimentQueryUrl(string view, int page = 1) =>
        ExperimentUrl(ExperimentSort, QueryExperimentSearch, view, page);

    private static string LocalizedPath(string path) => LocalizedUrls.Current($"/{path}");

    private static string LocalizedUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var absolute))
            return url;
        var path = absolute.AbsolutePath;
        return LocalizedUrls.Current(path);
    }
}
