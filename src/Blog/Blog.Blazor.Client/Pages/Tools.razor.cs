using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class Tools
{
    private static string CanonicalPath => Action;
    private const int PageSize = 20;
    private string _search = string.Empty;
    private string _category = string.Empty;
    private int _page = 1;

    [SupplyParameterFromQuery(Name = "q")]
    private string? QuerySearch { get; set; }

    [SupplyParameterFromQuery(Name = "category")]
    private string? QueryCategory { get; set; }

    [SupplyParameterFromQuery(Name = "page")]
    private int? QueryPage { get; set; }

    [SupplyParameterFromQuery(Name = "view")]
    private string? QueryView { get; set; }
    private static string Action => LocalizedUrls.Current("/tools");
    private string Title => ToolsL["tools"];
    private string Description => ToolsL["description"];
    private string FiltersLabel => ToolsL["filters"];
    private string SearchLabel => ToolsL["search"];
    private string SearchPlaceholder => ToolsL["search_placeholder"];
    private string CategoryLabel => ToolsL["category"];
    private string AllCategoriesLabel => ToolsL["all_categories"];
    private string NoCategoryLabel => ToolsL["no_category"];
    private string ApplyLabel => ToolsL["apply_filters"];
    private string ClearLabel => ToolsL["clear_filters"];
    private string NoResultsLabel => ToolsL["no_results"];
    private string PaginationLabel => ToolsL["pagination"];
    private string PreviousLabel => ToolsL["previous"];
    private string NextLabel => ToolsL["next"];
    private static IReadOnlyList<string> Categories => ToolCatalog.Categories;
    private IReadOnlyList<SiteSelectOption> CategoryOptions =>
        Categories
            .Select(category => new SiteSelectOption(category, category))
            .Prepend(new SiteSelectOption("", AllCategoriesLabel))
            .ToArray();
    private IReadOnlyList<ToolDefinition> FilteredItems =>
        ToolCatalog.Filter(QuerySearch ?? string.Empty, QueryCategory ?? string.Empty);
    private int TotalPages => PageCountFor(FilteredItems.Count, PageSize);
    private int Page => CurrentPageFor(_page, TotalPages);
    private IReadOnlyList<ToolDefinition> PageItems => ItemsForPage(FilteredItems, Page, PageSize);
    private bool DenseView => string.Equals(QueryView, "dense", StringComparison.OrdinalIgnoreCase);
    private string ViewMode => DenseView ? "dense" : "spacious";
    private string ResultsSummary =>
        ToolsL["results_summary", PageItems.Count, FilteredItems.Count];

    private string Search
    {
        get => _search;
        set => _search = value;
    }

    private string Category
    {
        get => _category;
        set => _category = value;
    }

    protected override void OnParametersSet()
    {
        _search = QuerySearch ?? string.Empty;
        _category = QueryCategory ?? string.Empty;
        _page = QueryPage.GetValueOrDefault(1);
    }

    private void ApplyFilters() =>
        Navigation.NavigateTo(ListingUrl(_search, _category, ViewMode, 1));

    private static string ToolUrl(ToolDefinition tool) =>
        LocalizedUrls.Current($"/tools/{tool.Slug}");

    private static string LocalizedTitle(ToolDefinition tool) =>
        ToolCatalog.LocalizedTitle(tool, CultureInfo.CurrentUICulture);

    private static string LocalizedDescription(ToolDefinition tool) =>
        ToolCatalog.LocalizedDescription(tool, CultureInfo.CurrentUICulture);

    private string PageUrl(int page) => PageUrl(ViewMode, page);

    private string PageUrl(string view, int page) =>
        ListingUrl(QuerySearch ?? string.Empty, QueryCategory ?? string.Empty, view, page);

    private static string ListingUrl(string search, string category, string view, int page) =>
        $"{Action}?q={Uri.EscapeDataString(search)}&category={Uri.EscapeDataString(category)}{(view.Equals("dense", StringComparison.OrdinalIgnoreCase) ? "&view=dense" : string.Empty)}{(page > 1 ? $"&page={page}" : string.Empty)}";
}
