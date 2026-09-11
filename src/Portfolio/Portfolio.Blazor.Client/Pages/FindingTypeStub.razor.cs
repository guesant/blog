using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class FindingTypeStub
{
    [Parameter]
    public string Type { get; set; } = string.Empty;

    [SupplyParameterFromQuery(Name = "sort")]
    private string? QuerySort { get; set; }

    [SupplyParameterFromQuery(Name = "view")]
    private string? QueryView { get; set; }

    [SupplyParameterFromQuery(Name = "page")]
    private int? QueryPage { get; set; }
    private string NormalizedType => Type.Replace('-', ' ').Trim();
    private string Title => TypeName(NormalizedType);
    private string Description => L["classified_findings", Title];
    private string CanonicalPath => RequestPath;
    private string Action => LocalizedUrls.Current($"/findings/types/{Type}");
    private string Sort => QuerySort is "asc" or "alpha" ? QuerySort : "desc";
    private string _sortValue = "desc";
    private string SortValue
    {
        get => _sortValue;
        set => _sortValue = value is "asc" or "alpha" or "desc" ? value : "desc";
    }
    private IReadOnlyList<SiteSelectOption> SortOptions =>
        [
            new("desc", L["legacy_77c78d92c603"]),
            new("asc", L["legacy_07b165cdd970"]),
            new("alpha", L["legacy_cc8d79d78bef"]),
        ];
    private int CurrentPage => CurrentPageFor(QueryPage, PageCount);
    private const int PageSize = 20;
    private PublicFinding? KnownType =>
        Snapshot?.Findings.FirstOrDefault(item =>
            string.Equals(item.Type, Type, StringComparison.OrdinalIgnoreCase)
            || string.Equals(item.Type?.Replace(' ', '-'), Type, StringComparison.OrdinalIgnoreCase)
        );
    private IReadOnlyList<PublicFinding> TypedFindings =>
        Snapshot
            ?.Findings.Where(item =>
                string.Equals(item.Type, Type, StringComparison.OrdinalIgnoreCase)
                || string.Equals(
                    item.Type?.Replace(' ', '-'),
                    Type,
                    StringComparison.OrdinalIgnoreCase
                )
            )
            .ToArray()
        ?? [];
    private IReadOnlyList<PublicFinding> SortedFindings =>
        (
            Sort == "alpha"
                ? TypedFindings.OrderBy(
                    item => item.Title ?? item.Slug,
                    StringComparer.OrdinalIgnoreCase
                )
            : Sort == "asc" ? TypedFindings.OrderBy(item => item.PublishedDate ?? string.Empty)
            : TypedFindings.OrderByDescending(item => item.PublishedDate ?? string.Empty)
        ).ToArray();
    private IReadOnlyList<PublicFinding> PagedFindings =>
        ItemsForPage(SortedFindings, CurrentPage, PageSize);
    private int PageCount => PageCountFor(SortedFindings.Count, PageSize);
    private string ResultsSummary =>
        L["showing_findings", PagedFindings.Count, SortedFindings.Count];
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(CrumbLabel("findings", L["legacy_a2d8de463c5a"]), FeedUrls.ForKind(FeedUrls.Finding))];

    protected override void OnParametersSet() => SortValue = Sort;

    private string TypeLabel(string? value) => TypeName(value);

    private bool DenseView => string.Equals(QueryView, "dense", StringComparison.OrdinalIgnoreCase);
    private string ViewMode => DenseView ? "dense" : "spacious";

    private string QueryUrl(string view, int page) =>
        $"{Action}?sort={Uri.EscapeDataString(Sort)}&view={view}&page={CurrentPageFor(page, PageCount)}";

    private string TypeName(string? value) =>
        string.IsNullOrWhiteSpace(value)
            ? (L["legacy_f3b74f6bb3d7"])
            : value.ToLowerInvariant() switch
            {
                "book" => L["legacy_f64f90d110a7"],
                "article" => L["legacy_8a7b563164e6"],
                "paper" => L["legacy_e3944d90d2b9"],
                "repo" => L["legacy_3f6ede9e4d29"],
                "site" => L["legacy_40bd62db98af"],
                "docs" => L["legacy_9e5e2519972c"],
                "tool" => L["legacy_c1ce4f438b8b"],
                "course" => L["legacy_7101bea24f0f"],
                "video" => L["legacy_1da31972a3bc"],
                "playlist" => "playlist",
                "channel" => L["legacy_806b1ac02287"],
                "podcast" => "podcast",
                "film" => L["legacy_6df5e95d416e"],
                "other" => L["legacy_f44ac71ffd29"],
                _ => value.Replace('-', ' '),
            };

    private static string LocalizedUrl(string url) => LocalizedUrls.Current(url);

    private string LocalizedPath(string path) =>
        path.Equals("home", StringComparison.OrdinalIgnoreCase)
            ? (L["legacy_0607643fd42c"])
            : (LocalizedUrls.Current($"/{path}"));
}
