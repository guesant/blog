using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class CollectionDetail
{
    [Parameter]
    public string Slug { get; set; } = string.Empty;
    private PublicCollection? Collection =>
        Snapshot?.Collections.FirstOrDefault(item =>
            PublicRouteKey.Matches(item.Url, item.Slug, Slug)
        );
    private string Title => Collection?.Title ?? Slug;
    private string Description => Collection?.Description ?? NotFoundDescription;
    private string CanonicalPath => Collection?.Url ?? RequestPath;
    private string LoadingLabel => L["legacy_9683d8c027c5"];
    private string EmptyLabel => L["legacy_190d1b0e3115"];
    private string ItemsLabel => L["legacy_2dd7696008c3"];
    private string NotFoundLabel => L["legacy_5e618bd2ed6c"];
    private string NotFoundDescription => L["legacy_efc41f7ca04b"];
    private string BackLabel => L["legacy_c9d2e6d195c0"];
    private static string IndexUrl => FeedUrls.ForKind(FeedUrls.Collection);
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [
            new(L["legacy_8bac078d4fc4"], FeedUrls.ForKind(FeedUrls.Collection)),
            new(L["legacy_5dbf11ad96f1"], IndexUrl),
        ];

    private static string LocalizedUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var absolute))
            return url;
        var path = absolute.AbsolutePath;
        return LocalizedUrls.Current(path);
    }

    private static string LocalizedPath(string path) => LocalizedUrls.Current($"/{path}");

    private string TypeName(string? value) =>
        value?.ToLowerInvariant() switch
        {
            "book" => L["legacy_52a466550e65"],
            "paper" => "paper",
            "video" => L["legacy_a72255f4487a"],
            "course" => L["legacy_d2b5307e2886"],
            "tool" => L["legacy_c3d6b5e3dba2"],
            null or "" => L["legacy_024313615d66"],
            _ => value,
        };

    private string RatingName(string? value) =>
        value?.ToLowerInvariant() switch
        {
            "interesting" => L["legacy_4a7bae9ea04d"],
            "recommended" => L["legacy_f81edcb6d6b8"],
            "strongly-recommended" => L["legacy_d9432986b51f"],
            "not-recommended" => L["legacy_efe593228740"],
            "not-rated" or null or "" => string.Empty,
            _ => value,
        };

    private static string JoinMeta(params string?[] values) =>
        string.Join(" · ", values.Where(value => !string.IsNullOrWhiteSpace(value)));
}
