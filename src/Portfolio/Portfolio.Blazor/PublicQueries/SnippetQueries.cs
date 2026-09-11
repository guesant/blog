using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.PublicQueries;

internal sealed record SnippetRow(
    int Id,
    string Slug,
    string PublicId,
    bool ShowHistory,
    DateOnly? PublishedAt,
    DateTime? UpdatedAt,
    string? Title,
    string? Description
);

internal sealed record SnippetFileRow(
    int SnippetId,
    int Id,
    string Path,
    string? Language,
    string Content
);

internal static class SnippetQueries
{
    internal static List<SnippetRow> Snippets(PortfolioPublicDbContext db, string locale) =>
        (
            from s in db.Snippets
            from t in db
                .SnippetTranslations.Where(t => t.SnippetId == s.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .SnippetTranslations.Where(en => en.SnippetId == s.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby s.Order, s.Id
            select new SnippetRow(
                s.Id,
                s.Slug,
                s.PublicId,
                s.ShowHistory,
                s.PublishedAt,
                s.UpdatedAt,
                t.Title ?? en.Title,
                t.Description ?? en.Description
            )
        ).ToList();

    internal static List<SnippetFileRow> Files(PortfolioPublicDbContext db) =>
        (
            from f in db.SnippetFiles
            join s in db.Snippets on f.SnippetId equals s.Id
            orderby f.SnippetId, f.Order, f.Id
            select new SnippetFileRow(f.SnippetId, f.Id, f.Path, f.Language, f.Content)
        ).ToList();

    internal static List<RelatedRow> RelatedRecent(
        PortfolioPublicDbContext db,
        int id,
        string locale
    ) =>
        db
            .Snippets.Where(s => s.Id != id)
            .OrderBy(s => s.PublishedAt == null ? 1 : 0)
            .ThenByDescending(s => s.PublishedAt)
            .ThenBy(s => s.Id)
            .Take(3)
            .Select(s => new RelatedRow(
                s.Slug,
                s.PublicId,
                s.Translations.Where(t => t.Locale == locale).Select(t => t.Title).FirstOrDefault(),
                s.PublishedAt
            ))
            .ToList();
}
