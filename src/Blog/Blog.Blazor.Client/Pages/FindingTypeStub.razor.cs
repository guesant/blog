using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

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
        [new("desc", L["default"]), new("asc", L["newest"]), new("alpha", L["alphabetical"])];
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
        [new(CrumbLabel("findings", L["findings"]), FeedUrls.ForKind(FeedUrls.Finding))];

    protected override void OnParametersSet() => SortValue = Sort;

    private string TypeLabel(string? value) => TypeName(value);

    private bool DenseView => string.Equals(QueryView, "dense", StringComparison.OrdinalIgnoreCase);
    private string ViewMode => DenseView ? "dense" : "spacious";

    private string QueryUrl(string view, int page) =>
        $"{Action}?sort={Uri.EscapeDataString(Sort)}&view={view}&page={CurrentPageFor(page, PageCount)}";

    private string TypeName(string? value) =>
        string.IsNullOrWhiteSpace(value)
            ? (L["finding"])
            : value.ToLowerInvariant() switch
            {
                "book" => L["book"],
                "article" => L["article"],
                "paper" => L["article"],
                "repo" => L["repository"],
                "site" => L["site"],
                "docs" => L["documentation"],
                "tool" => L["tool"],
                "course" => L["course"],
                "video" => L["video"],
                "playlist" => "playlist",
                "channel" => L["channel"],
                "podcast" => "podcast",
                "film" => L["film"],
                "other" => L["other"],
                _ => value.Replace('-', ' '),
            };

    private static string LocalizedUrl(string url) => LocalizedUrls.Current(url);

    private string LocalizedPath(string path) =>
        path.Equals("home", StringComparison.OrdinalIgnoreCase)
            ? (L[""])
            : (LocalizedUrls.Current($"/{path}"));
}
