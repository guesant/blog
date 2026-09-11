using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.PublicQueries;

internal static class FeaturedQueries
{
    private const string PageSlug = "portfolio";

    internal static List<string> CaseSlugs(PortfolioPublicDbContext db) =>
        (
            from p in db.Pages
            join x in db.PageFeaturedCases on p.Id equals x.PageId
            join c in db.CaseStudies on x.CaseStudyId equals c.Id
            where p.Slug == PageSlug
            orderby (x.Order == null ? 0 : 1), x.Order, x.CaseStudyId
            select c.Slug
        )
            .Take(3)
            .ToList();

    internal static List<string> ProjectSlugs(PortfolioPublicDbContext db) =>
        (
            from p in db.Pages
            join x in db.PageFeaturedProjects on p.Id equals x.PageId
            join c in db.Projects on x.ProjectId equals c.Id
            where p.Slug == PageSlug
            orderby (x.Order == null ? 0 : 1), x.Order, x.ProjectId
            select c.Slug
        )
            .Take(3)
            .ToList();

    internal static List<string> WritingSlugs(PortfolioPublicDbContext db) =>
        (
            from p in db.Pages
            join x in db.PageFeaturedWritings on p.Id equals x.PageId
            join w in db.Writings on x.WritingId equals w.Id
            where p.Slug == PageSlug
            orderby (x.Order == null ? 0 : 1), x.Order, x.WritingId
            select w.Slug
        ).ToList();
}
