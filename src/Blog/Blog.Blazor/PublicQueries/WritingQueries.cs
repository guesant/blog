using Blog.Blazor.Data;

namespace Blog.Blazor.PublicQueries;

internal sealed record WritingRow(
    int Id,
    string Slug,
    string PublicId,
    string Type,
    DateTime? DateIso,
    DateTime? UpdatedAt,
    bool ShowHistory,
    string? Title,
    string? Excerpt,
    string? ReadingTime,
    string? Body
);

internal sealed record RelatedWritingRow(
    string Slug,
    string PublicId,
    string? Title,
    DateTime? Date
);

internal static class WritingQueries
{
    internal static List<WritingRow> Writings(BlogPublicDbContext db, string locale) =>
        (
            from w in db.Writings
            from t in db
                .WritingTranslations.Where(t => t.WritingId == w.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .WritingTranslations.Where(en => en.WritingId == w.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby (w.DateIso == null ? 1 : 0), w.DateIso descending, w.Id
            select new WritingRow(
                w.Id,
                w.Slug,
                w.PublicId,
                w.Type,
                w.DateIso,
                w.UpdatedAt,
                w.ShowHistory,
                t.Title ?? en.Title,
                t.Excerpt ?? en.Excerpt,
                t.ReadingTime ?? en.ReadingTime,
                t.Body ?? en.Body
            )
        ).ToList();

    internal static List<RelatedWritingRow> Related(BlogPublicDbContext db, int id, string locale)
    {
        var topicId = db
            .Topicables.Where(x => x.TopicableType == "writing" && x.TopicableId == id)
            .OrderBy(x => x.Id)
            .Select(x => (int?)x.TopicId)
            .FirstOrDefault();
        if (topicId is null)
            return [];
        return db
            .Writings.Where(w =>
                w.Id != id
                && db.Topicables.Any(link =>
                    link.TopicId == topicId
                    && link.TopicableType == "writing"
                    && link.TopicableId == w.Id
                )
            )
            .OrderBy(w => w.DateIso == null ? 1 : 0)
            .ThenByDescending(w => w.DateIso)
            .ThenBy(w => w.Id)
            .Take(3)
            .Select(w => new RelatedWritingRow(
                w.Slug,
                w.PublicId,
                w.Translations.Where(t => t.Locale == locale).Select(t => t.Title).FirstOrDefault(),
                w.DateIso
            ))
            .ToList();
    }
}
