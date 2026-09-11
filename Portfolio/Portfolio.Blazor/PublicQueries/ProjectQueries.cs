using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.PublicQueries;

internal sealed record ProjectRow(
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
    string? Problem,
    string? CurrentFocus,
    string? Status,
    string? Metrics,
    string? Body
);

internal sealed record OwnerTechnologyRow(int OwnerId, string Slug, string? Name);

internal sealed record RelatedRow(string Slug, string PublicId, string? Title, DateOnly? Date);

internal static class ProjectQueries
{
    internal static List<ProjectRow> Projects(PortfolioPublicDbContext db, string locale) =>
        (
            from p in db.Projects
            from t in db
                .ProjectTranslations.Where(t => t.ProjectId == p.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .ProjectTranslations.Where(en => en.ProjectId == p.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby p.Order, p.Id
            select new ProjectRow(
                p.Id,
                p.Slug,
                p.PublicId,
                p.Href,
                p.External,
                p.ShowHistory,
                p.PublishedAt,
                p.UpdatedAt,
                t.Name ?? en.Name,
                t.Purpose ?? en.Purpose,
                t.Problem ?? en.Problem,
                t.CurrentFocus ?? en.CurrentFocus,
                t.Status ?? en.Status,
                t.Metrics ?? en.Metrics,
                t.Body ?? en.Body
            )
        ).ToList();

    internal static List<OwnerTechnologyRow> Technologies(
        PortfolioPublicDbContext db,
        string locale
    ) =>
        (
            from x in db.ProjectTechnologies
            join p in db.Projects on x.ProjectId equals p.Id
            join t in db.Technologies on x.TechnologyId equals t.Id
            from tt in db
                .TechnologyTranslations.Where(tt => tt.TechnologyId == t.Id && tt.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .TechnologyTranslations.Where(en => en.TechnologyId == t.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby p.Id, t.Order, t.Slug, t.Id
            select new OwnerTechnologyRow(p.Id, t.Slug, tt.Name ?? en.Name)
        ).ToList();

    internal static List<RelatedRow> RelatedBySharedTechnology(
        PortfolioPublicDbContext db,
        int id,
        string locale
    ) =>
        db
            .Projects.Where(p =>
                p.Id != id
                && db.ProjectTechnologies.Any(current =>
                    current.ProjectId == id
                    && db.ProjectTechnologies.Any(related =>
                        related.TechnologyId == current.TechnologyId && related.ProjectId == p.Id
                    )
                )
            )
            .OrderBy(p => p.PublishedAt == null ? 1 : 0)
            .ThenByDescending(p => p.PublishedAt)
            .ThenBy(p => p.Id)
            .Take(3)
            .Select(p => new RelatedRow(
                p.Slug,
                p.PublicId,
                p.Translations.Where(t => t.Locale == locale).Select(t => t.Name).FirstOrDefault(),
                p.PublishedAt
            ))
            .ToList();

    internal static List<RelatedRow> RelatedRecent(
        PortfolioPublicDbContext db,
        int id,
        string locale
    ) =>
        db
            .Projects.Where(p => p.Id != id)
            .OrderBy(p => p.PublishedAt == null ? 1 : 0)
            .ThenByDescending(p => p.PublishedAt)
            .ThenBy(p => p.Id)
            .Take(3)
            .Select(p => new RelatedRow(
                p.Slug,
                p.PublicId,
                p.Translations.Where(t => t.Locale == locale).Select(t => t.Name).FirstOrDefault(),
                p.PublishedAt
            ))
            .ToList();
}
