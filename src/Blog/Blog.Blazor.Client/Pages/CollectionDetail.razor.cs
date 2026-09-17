using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class CollectionDetail
{
    [Parameter]
    public string Slug { get; set; } = string.Empty;
    private PublicCollection? Collection =>
        Snapshot?.Collections.FirstOrDefault(item =>
            PublicRouteKey.Matches(item.Url, item.Slug, Slug)
        );
    protected override bool IsNotFound => Collection is null;
    private string Title => Collection?.Title ?? Slug;
    private string Description => Collection?.Description ?? NotFoundDescription;
    private string CanonicalPath => Collection?.Url ?? RequestPath;
    private string LoadingLabel => L["loading_collection"];
    private string EmptyLabel => L["this_collection_has_no_public_items_yet"];
    private string ItemsLabel => L["collection_items"];
    private string NotFoundLabel => L["collection_not_found"];
    private string NotFoundDescription => L["this_address_does_not_match_a_public_collection"];
    private string BackLabel => L["back_to_collections"];
    private static string IndexUrl => FeedUrls.ForKind(FeedUrls.Collection);
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(CrumbLabel("collections", L["collections"]), IndexUrl)];

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
            "book" => L["book"],
            "paper" => "paper",
            "video" => L["video"],
            "course" => L["course"],
            "tool" => L["tool"],
            null or "" => L["finding"],
            _ => value,
        };

    private string RatingName(string? value) =>
        value?.ToLowerInvariant() switch
        {
            "interesting" => L["interesting"],
            "recommended" => L["recommended"],
            "strongly-recommended" => L["strongly_recommended"],
            "not-recommended" => L["not_recommended"],
            "not-rated" or null or "" => string.Empty,
            _ => value,
        };
}
