using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class SnippetDetail
{
    [Parameter]
    public string Slug { get; set; } = string.Empty;
    private PublicSnippet? Snippet =>
        Snapshot?.Snippets.FirstOrDefault(item =>
            PublicRouteKey.Matches(item.Url, item.Slug, Slug)
        );
    private string Title => Snippet?.Title ?? Slug;
    private string Description => Snippet?.Description ?? NotFoundDescription;
    private string CanonicalPath => Snippet?.Url ?? RequestPath;
    private string LoadingLabel => L["legacy_140e4632c54b"];
    private string FileCount => L["count_files", Snippet?.Files?.Count ?? 0];
    private string FilesLabel => L["legacy_18a94588a50e"];
    private string EmptyLabel => L["legacy_d2a544d7a50f"];
    private string NotFoundLabel => L["legacy_2f77a758b681"];
    private string NotFoundDescription => L["legacy_3b8af3970aa7"];
    private string BackLabel => L["legacy_9788633fccc2"];
    private string IndexUrl => LocalizedPath("snippets");
    private string DownloadUrl => $"{IndexUrl}/{Snippet?.Slug ?? Slug}/download";
    private string? ActiveFileId => QueryValue("file");
    private PublicSnippetFile? ActiveFile =>
        Snippet?.Files?.FirstOrDefault(file => file.Id == ActiveFileId)
        ?? Snippet?.Files?.FirstOrDefault();
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(CrumbLabel("snippets", L["legacy_b87eedb8eefd"]), IndexUrl)];
    private static IReadOnlyList<string> SnippetHistoryFields => ["title", "description"];

    private static string SafeId(string path) =>
        string.Concat(path.Select(character => char.IsLetterOrDigit(character) ? character : '-'));

    private static string FileAnchor(PublicSnippetFile file) =>
        string.IsNullOrWhiteSpace(file.Id)
            ? $"#file-{SafeId(file.Path)}"
            : $"?file={Uri.EscapeDataString(file.Id)}#file-{SafeId(file.Path)}";

    private string? QueryValue(string name) =>
        new Uri(Navigation.Uri)
            .Query.TrimStart('?')
            .Split('&', StringSplitOptions.RemoveEmptyEntries)
            .Select(value => value.Split('=', 2))
            .Where(parts =>
                parts.Length == 2
                && Uri.UnescapeDataString(parts[0]).Equals(name, StringComparison.OrdinalIgnoreCase)
            )
            .Select(parts => Uri.UnescapeDataString(parts[1]))
            .FirstOrDefault();

    private string LocalizedPath(string path) =>
        path.Equals("home", StringComparison.OrdinalIgnoreCase)
            ? (L["legacy_0607643fd42c"])
            : (LocalizedUrls.Current($"/{path}"));
}
