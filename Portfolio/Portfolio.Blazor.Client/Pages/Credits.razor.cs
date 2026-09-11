using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Credits
{
    private string Title => PageField("title", L["legacy_eb7813cfa4e0"]);
    private string Description => PageField("description", L["legacy_35a1c8b4f3f9"]);
    private static string CanonicalPath => LocalizedUrls.Current("/credits");
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
            new("", L["legacy_d878d9136e0e"]),
            new("desc", L["legacy_77c78d92c603"]),
            new("asc", L["legacy_07b165cdd970"]),
            new("alpha", "A–Z"),
        ];

    private string CategoryLabel(string category) =>
        category.ToLowerInvariant() switch
        {
            "font" => L["legacy_c56e7c0eec0f"],
            "reference" => L["legacy_bcbf55423dd0"],
            "infrastructure" => L["legacy_351f47acccb1"],
            "library" => L["legacy_cf1488bbaf91"],
            _ => category,
        };

    private IReadOnlyList<PublicCredit> MatchingCredits =>
        (Snapshot?.Credits ?? [])
            .Where(item => MatchesSearch(QuerySearch, item.Name, item.Description))
            .ToArray();
    private IReadOnlyList<PublicCredit> SortedCredits =>
        Sort switch
        {
            "asc" => MatchingCredits.OrderBy(item => item.CreatedAt ?? string.Empty).ToArray(),
            "desc" => MatchingCredits
                .OrderByDescending(item => item.CreatedAt ?? string.Empty)
                .ToArray(),
            "alpha" => MatchingCredits
                .OrderBy(item => item.Name, StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            _ => MatchingCredits,
        };
    private static int PageCount => 1;
    private static int CurrentPage => 1;
    private IReadOnlyList<PublicCredit> PagedCredits => SortedCredits;
    private bool DenseView => string.Equals(QueryView, "dense", StringComparison.OrdinalIgnoreCase);
    private string ViewMode => DenseView ? "dense" : "spacious";
    private IReadOnlyList<CreditSection> CreditSections =>
        Snapshot is null
            ? []
            :
            [
                new(
                    "acknowledgements",
                    L["legacy_ba8eda005076"],
                    PagedCredits
                        .Where(item =>
                            item.Category.Equals("reference", StringComparison.OrdinalIgnoreCase)
                            && string.IsNullOrWhiteSpace(item.Url)
                        )
                        .ToArray(),
                    false
                ),
                new(
                    "font",
                    CategoryLabel("font"),
                    PagedCredits
                        .Where(item =>
                            item.Category.Equals("font", StringComparison.OrdinalIgnoreCase)
                        )
                        .ToArray(),
                    true
                ),
                new(
                    "reference",
                    CategoryLabel("reference"),
                    PagedCredits
                        .Where(item =>
                            item.Category.Equals("reference", StringComparison.OrdinalIgnoreCase)
                            && !string.IsNullOrWhiteSpace(item.Url)
                        )
                        .ToArray(),
                    true
                ),
                new(
                    "infrastructure",
                    CategoryLabel("infrastructure"),
                    PagedCredits
                        .Where(item =>
                            item.Category.Equals(
                                "infrastructure",
                                StringComparison.OrdinalIgnoreCase
                            )
                        )
                        .ToArray(),
                    true
                ),
                new(
                    "library",
                    CategoryLabel("library"),
                    PagedCredits
                        .Where(item =>
                            item.Category.Equals("library", StringComparison.OrdinalIgnoreCase)
                        )
                        .ToArray(),
                    true
                ),
                new(
                    "inspiration",
                    CategoryLabel("inspiration"),
                    PagedCredits
                        .Where(item =>
                            item.Category.Equals("inspiration", StringComparison.OrdinalIgnoreCase)
                        )
                        .ToArray(),
                    true
                ),
            ];

    private string PageUrl(int page) => PageUrl(ViewMode, page);

    private string PageUrl(string view, int page) =>
        ListingUrl(
            CanonicalPath,
            Sort,
            QuerySearch,
            view.Equals("dense", StringComparison.OrdinalIgnoreCase),
            page
        );

    private string PageField(string name, string fallback)
    {
        if (
            Snapshot?.Pages.TryGetValue("credits", out var page) != true
            || page.ValueKind != System.Text.Json.JsonValueKind.Object
            || !page.TryGetProperty(name, out var value)
            || value.ValueKind != System.Text.Json.JsonValueKind.String
        )
            return fallback;
        return value.GetString() ?? fallback;
    }

    private static string? SafeUrl(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https"
            ? uri.AbsoluteUri
            : null;

    protected override void OnParametersSet()
    {
        SortValue = Sort;
        _search = QuerySearch ?? string.Empty;
    }

    private sealed record CreditSection(
        string Key,
        string Label,
        IReadOnlyList<PublicCredit> Items,
        bool LinkItems
    );
}
