using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.PublicQueries;

internal sealed record CaseStudyRow(
    int Id,
    string Slug,
    string PublicId,
    string? Href,
    bool External,
    bool ShowHistory,
    DateOnly? PublishedAt,
    DateTime? UpdatedAt,
    string? Title,
    string? Status,
    string? Meta,
    string? Summary,
    string? Context,
    string? Role,
    string? Result,
    string? Metrics,
    string? Body
);

internal static class CaseStudyQueries
{
    internal static List<CaseStudyRow> Cases(PortfolioPublicDbContext db, string locale) =>
        (
            from c in db.CaseStudies
            from t in db
                .CaseStudyTranslations.Where(t => t.CaseStudyId == c.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .CaseStudyTranslations.Where(en => en.CaseStudyId == c.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby c.Order, c.Id
            select new CaseStudyRow(
                c.Id,
                c.Slug,
                c.PublicId,
                c.Href,
                c.External,
                c.ShowHistory,
                c.PublishedAt,
                c.UpdatedAt,
                t.Title ?? en.Title,
                t.Status ?? en.Status,
                t.Meta ?? en.Meta,
                t.Summary ?? en.Summary,
                t.Context ?? en.Context,
                t.Role ?? en.Role,
                t.Result ?? en.Result,
                t.Metrics ?? en.Metrics,
                t.Body ?? en.Body
            )
        ).ToList();

    internal static List<OwnerTechnologyRow> Technologies(
        PortfolioPublicDbContext db,
        string locale
    ) =>
        (
            from x in db.CaseStudyTechnologies
            join c in db.CaseStudies on x.CaseStudyId equals c.Id
            join t in db.Technologies on x.TechnologyId equals t.Id
            from tt in db
                .TechnologyTranslations.Where(tt => tt.TechnologyId == t.Id && tt.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .TechnologyTranslations.Where(en => en.TechnologyId == t.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby c.Id, t.Order, t.Slug, t.Id
            select new OwnerTechnologyRow(c.Id, t.Slug, tt.Name ?? en.Name)
        ).ToList();

    internal static List<RelatedRow> RelatedBySharedTechnology(
        PortfolioPublicDbContext db,
        int id,
        string locale
    ) =>
        db
            .CaseStudies.Where(c =>
                c.Id != id
                && db.CaseStudyTechnologies.Any(current =>
                    current.CaseStudyId == id
                    && db.CaseStudyTechnologies.Any(related =>
                        related.TechnologyId == current.TechnologyId && related.CaseStudyId == c.Id
                    )
                )
            )
            .OrderBy(c => c.PublishedAt == null ? 1 : 0)
            .ThenByDescending(c => c.PublishedAt)
            .ThenBy(c => c.Id)
            .Take(3)
            .Select(c => new RelatedRow(
                c.Slug,
                c.PublicId,
                c.Translations.Where(t => t.Locale == locale).Select(t => t.Title).FirstOrDefault(),
                c.PublishedAt
            ))
            .ToList();

    internal static List<RelatedRow> RelatedRecent(
        PortfolioPublicDbContext db,
        int id,
        string locale
    ) =>
        db
            .CaseStudies.Where(c => c.Id != id)
            .OrderBy(c => c.PublishedAt == null ? 1 : 0)
            .ThenByDescending(c => c.PublishedAt)
            .ThenBy(c => c.Id)
            .Take(3)
            .Select(c => new RelatedRow(
                c.Slug,
                c.PublicId,
                c.Translations.Where(t => t.Locale == locale).Select(t => t.Title).FirstOrDefault(),
                c.PublishedAt
            ))
            .ToList();
}
