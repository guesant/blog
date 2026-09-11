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
    private string LoadingLabel => L["loading_snippet"];
    private string FileCount => L["count_files", Snippet?.Files?.Count ?? 0];
    private string FilesLabel => L["snippet_files_count_0_arquivos"];
    private string EmptyLabel => L["snippet_files"];
    private string NotFoundLabel => L["this_snippet_has_no_public_files"];
    private string NotFoundDescription => L["snippet_not_found"];
    private string BackLabel => L["this_address_does_not_match_a_public_snippet"];
    private string IndexUrl => LocalizedPath("snippets");
    private string DownloadUrl => $"{IndexUrl}/{Snippet?.Slug ?? Slug}/download";
    private string? ActiveFileId => QueryValue("file");
    private PublicSnippetFile? ActiveFile =>
        Snippet?.Files?.FirstOrDefault(file => file.Id == ActiveFileId)
        ?? Snippet?.Files?.FirstOrDefault();
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(CrumbLabel("snippets", L["snippets"]), IndexUrl)];
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
            ? (L[""])
            : (LocalizedUrls.Current($"/{path}"));
}
