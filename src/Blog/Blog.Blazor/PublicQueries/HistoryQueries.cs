using Blog.Blazor.Data;

namespace Blog.Blazor.PublicQueries;

internal sealed record HistoryRow(
    int OwnerId,
    int Id,
    DateTime? CreatedAt,
    string? OldValues,
    string? NewValues
);

internal sealed class TranslationKey
{
    public int OwnerId { get; init; }
    public int TranslationId { get; init; }
}

internal static class HistoryQueries
{
    internal static List<HistoryRow> ForProjects(BlogPublicDbContext db, string locale) =>
        Translated(
            db,
            "App\\Models\\ProjectTranslation",
            from t in db.ProjectTranslations
            join p in db.Projects on t.ProjectId equals p.Id
            where t.Locale == locale
            select new TranslationKey { OwnerId = p.Id, TranslationId = t.Id }
        );

    internal static List<HistoryRow> ForCaseStudies(BlogPublicDbContext db, string locale) =>
        Translated(
            db,
            "App\\Models\\CaseStudyTranslation",
            from t in db.CaseStudyTranslations
            join c in db.CaseStudies on t.CaseStudyId equals c.Id
            where t.Locale == locale
            select new TranslationKey { OwnerId = c.Id, TranslationId = t.Id }
        );

    internal static List<HistoryRow> ForWritings(BlogPublicDbContext db, string locale) =>
        Translated(
            db,
            "App\\Models\\WritingTranslation",
            from t in db.WritingTranslations
            join w in db.Writings on t.WritingId equals w.Id
            where t.Locale == locale
            select new TranslationKey { OwnerId = w.Id, TranslationId = t.Id }
        );

    internal static List<HistoryRow> ForExperiments(BlogPublicDbContext db, string locale) =>
        Translated(
            db,
            "App\\Models\\ExperimentTranslation",
            from t in db.ExperimentTranslations
            join e in db.Experiments on t.ExperimentId equals e.Id
            where t.Locale == locale
            select new TranslationKey { OwnerId = e.Id, TranslationId = t.Id }
        );

    internal static List<HistoryRow> ForSnippets(BlogPublicDbContext db, string locale) =>
        Translated(
            db,
            "App\\Models\\SnippetTranslation",
            from t in db.SnippetTranslations
            join s in db.Snippets on t.SnippetId equals s.Id
            where t.Locale == locale
            select new TranslationKey { OwnerId = s.Id, TranslationId = t.Id }
        );

    internal static List<HistoryRow> ForSnippetFiles(BlogPublicDbContext db) =>
        Translated(
            db,
            "App\\Models\\SnippetFile",
            from f in db.SnippetFiles
            join s in db.Snippets on f.SnippetId equals s.Id
            select new TranslationKey { OwnerId = f.Id, TranslationId = f.Id }
        );

    private static List<HistoryRow> Translated(
        BlogPublicDbContext db,
        string type,
        IQueryable<TranslationKey> keys
    ) =>
        (
            from a in db.AuditLog
            join k in keys on a.AuditableId equals k.TranslationId
            where a.AuditableType == type && a.Action == "updated"
            orderby k.OwnerId, (a.CreatedAt == null ? 0 : 1), a.CreatedAt, a.Id
            select new HistoryRow(k.OwnerId, a.Id, a.CreatedAt, a.OldValues, a.NewValues)
        ).ToList();
}
