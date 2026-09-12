using Blog.Blazor.Data;

namespace Blog.Blazor.PublicQueries;

internal sealed record ExperimentRow(
    int Id,
    string Slug,
    string PublicId,
    string? Href,
    bool External,
    bool ShowHistory,
    DateOnly? PublishedAt,
    DateTime? UpdatedAt,
    string? Name,
    string? Purpose,
    string? Body
);

internal static class ExperimentQueries
{
    internal static List<ExperimentRow> Experiments(BlogPublicDbContext db, string locale) =>
        (
            from e in db.Experiments
            from t in db
                .ExperimentTranslations.Where(t => t.ExperimentId == e.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .ExperimentTranslations.Where(en => en.ExperimentId == e.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby e.Order, e.Id
            select new ExperimentRow(
                e.Id,
                e.Slug,
                e.PublicId,
                e.Href,
                e.External,
                e.ShowHistory,
                e.PublishedAt,
                e.UpdatedAt,
                t.Name ?? en.Name,
                t.Purpose ?? en.Purpose,
                t.Body ?? en.Body
            )
        ).ToList();

    internal static List<OwnerTechnologyRow> Technologies(BlogPublicDbContext db, string locale) =>
        (
            from x in db.ExperimentTechnologies
            join e in db.Experiments on x.ExperimentId equals e.Id
            join t in db.Technologies on x.TechnologyId equals t.Id
            from tt in db
                .TechnologyTranslations.Where(tt => tt.TechnologyId == t.Id && tt.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .TechnologyTranslations.Where(en => en.TechnologyId == t.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby e.Id, t.Order, t.Slug, t.Id
            select new OwnerTechnologyRow(e.Id, t.Slug, tt.Name ?? en.Name)
        ).ToList();

    internal static List<RelatedRow> RelatedBySharedTechnology(
        BlogPublicDbContext db,
        int id,
        string locale
    ) =>
        db
            .Experiments.Where(e =>
                e.Id != id
                && db.ExperimentTechnologies.Any(current =>
                    current.ExperimentId == id
                    && db.ExperimentTechnologies.Any(related =>
                        related.TechnologyId == current.TechnologyId && related.ExperimentId == e.Id
                    )
                )
            )
            .OrderBy(e => e.PublishedAt == null ? 1 : 0)
            .ThenByDescending(e => e.PublishedAt)
            .ThenBy(e => e.Id)
            .Take(3)
            .Select(e => new RelatedRow(
                e.Slug,
                e.PublicId,
                e.Translations.Where(t => t.Locale == locale).Select(t => t.Name).FirstOrDefault(),
                e.PublishedAt
            ))
            .ToList();

    internal static List<RelatedRow> RelatedRecent(BlogPublicDbContext db, int id, string locale) =>
        db
            .Experiments.Where(e => e.Id != id)
            .OrderBy(e => e.PublishedAt == null ? 1 : 0)
            .ThenByDescending(e => e.PublishedAt)
            .ThenBy(e => e.Id)
            .Take(3)
            .Select(e => new RelatedRow(
                e.Slug,
                e.PublicId,
                e.Translations.Where(t => t.Locale == locale).Select(t => t.Name).FirstOrDefault(),
                e.PublishedAt
            ))
            .ToList();
}
