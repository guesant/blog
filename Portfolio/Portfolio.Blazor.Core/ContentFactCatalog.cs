using System.Globalization;

namespace Portfolio.Blazor.Core;

public enum ContentFactValueKind
{
    Text,
    Number,
    Url,
    Date,
}

[Flags]
public enum ContentFactContentType
{
    None = 0,
    Book = 1 << 0,
    Repo = 1 << 1,
    Paper = 1 << 2,
    Video = 1 << 3,
    Film = 1 << 4,
    Finding = 1 << 5,
    CaseStudy = 1 << 6,
    Project = 1 << 7,
}

public readonly record struct ContentFactDefinition(
    string Key,
    ContentFactContentType ContentTypes,
    string Label,
    string PortugueseLabel,
    string Icon,
    ContentFactValueKind ValueKind = ContentFactValueKind.Text
);

public static class ContentFactCatalog
{
    public static string LocalizedLabel(ContentFactDefinition fact, CultureInfo culture) =>
        culture.Name.Equals("pt-BR", StringComparison.OrdinalIgnoreCase)
            ? fact.PortugueseLabel
            : fact.Label;

    private static readonly ContentFactDefinition[] Definitions =
    [
        new("isbn", ContentFactContentType.Book, "ISBN", "ISBN", "barcode"),
        new("publisher", ContentFactContentType.Book, "Publisher", "Editora", "building"),
        new("edition", ContentFactContentType.Book, "Edition", "Edição", "layers"),
        new(
            "pages",
            ContentFactContentType.Book,
            "Pages",
            "Páginas",
            "book-open",
            ContentFactValueKind.Number
        ),
        new("doi", ContentFactContentType.Paper, "DOI", "DOI", "link-2"),
        new("journal", ContentFactContentType.Paper, "Journal", "Periódico", "newspaper"),
        new(
            "conference",
            ContentFactContentType.Paper,
            "Conference",
            "Conferência",
            "presentation"
        ),
        new(
            "year",
            ContentFactContentType.Paper,
            "Year",
            "Ano",
            "calendar",
            ContentFactValueKind.Number
        ),
        new("org", ContentFactContentType.Repo, "Organization", "Organização", "building"),
        new("name", ContentFactContentType.Repo, "Repository", "Repositório", "tag"),
        new("language", ContentFactContentType.Repo, "Language", "Linguagem", "languages"),
        new("license", ContentFactContentType.Repo, "License", "Licença", "scale"),
        new("channel", ContentFactContentType.Video, "Channel", "Canal", "tv"),
        new("duration", ContentFactContentType.Video, "Duration", "Duração", "clock"),
        new("youtubeId", ContentFactContentType.Video, "YouTube ID", "ID do YouTube", "play"),
        new("director", ContentFactContentType.Film, "Director", "Diretor", "clapperboard"),
        new("imdbId", ContentFactContentType.Film, "IMDb ID", "ID do IMDb", "film"),
        new("tmdbId", ContentFactContentType.Film, "TMDb ID", "ID do TMDb", "film"),
        new(
            "found",
            ContentFactContentType.Finding,
            "found on",
            "encontrado em",
            "calendar",
            ContentFactValueKind.Date
        ),
        new("state", ContentFactContentType.Finding, "state", "estado", "clock"),
        new("context", ContentFactContentType.CaseStudy, "context", "contexto", "map-pin"),
        new("role", ContentFactContentType.CaseStudy, "role", "papel", "user"),
        new("outcome", ContentFactContentType.CaseStudy, "outcome", "resultado", "arrow-right"),
        new("problem", ContentFactContentType.Project, "problem", "problema", "triangle-alert"),
        new(
            "current-focus",
            ContentFactContentType.Project,
            "current focus",
            "foco atual",
            "target"
        ),
    ];

    public static IReadOnlyList<ContentFactDefinition> All => Definitions;

    public static bool TryFind(string? key, out ContentFactDefinition fact)
    {
        if (!string.IsNullOrEmpty(key))
        {
            foreach (var item in Definitions)
            {
                if (string.Equals(item.Key, key, StringComparison.Ordinal))
                {
                    fact = item;
                    return true;
                }
            }
        }

        fact = default;
        return false;
    }

    public static string? LabelFor(string? key, CultureInfo culture) =>
        TryFind(key, out var fact) ? LocalizedLabel(fact, culture) : null;

    public static string? IconFor(string? key) => TryFind(key, out var fact) ? fact.Icon : null;

    public static ContentFactContentType ContentTypeForResourceType(string? resourceType) =>
        resourceType?.Trim().ToLowerInvariant() switch
        {
            "book" => ContentFactContentType.Book,
            "repo" => ContentFactContentType.Repo,
            "paper" => ContentFactContentType.Paper,
            "video" => ContentFactContentType.Video,
            "film" => ContentFactContentType.Film,
            _ => ContentFactContentType.None,
        };
}
