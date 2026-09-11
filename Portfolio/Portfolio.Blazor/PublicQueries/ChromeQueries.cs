using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.PublicQueries;

internal sealed record SiteRow(
    int Id,
    string? ShortName,
    string? PortfolioUrl,
    string? SourceRepositoryUrl,
    bool ContactAvailable,
    bool MaintenanceEnabled,
    string? ContactEmail
);

internal sealed record ProfileRow(
    string? Name,
    DateOnly? BirthDate,
    string? Title,
    string? Location,
    string? Description,
    string? Milestones
);

internal sealed record PageRow(string Slug, DateTime? UpdatedAt, string? Fields);

internal sealed record ContactProfileRow(string Platform, string? Label, string Url);

internal sealed record SiteTranslationRow(
    string? MaintenanceEyebrow,
    string? MaintenanceTitle,
    string? MaintenanceDescription,
    string? Seo
);

internal sealed record NavRow(
    int Id,
    int? ParentId,
    string RouteName,
    string? Placement,
    int? SidebarGroup,
    string? Label
);

internal static class ChromeQueries
{
    internal static SiteRow? Site(PortfolioPublicDbContext db) =>
        db
            .SiteSettings.OrderBy(s => s.Id)
            .Select(s => new SiteRow(
                s.Id,
                s.ShortName,
                s.PortfolioUrl,
                s.SourceRepositoryUrl,
                s.ContactAvailable,
                s.MaintenanceEnabled,
                s.ContactEmail
            ))
            .FirstOrDefault();

    internal static string? ContactEmail(PortfolioPublicDbContext db) =>
        db.SiteSettings.OrderBy(s => s.Id).Select(s => s.ContactEmail).FirstOrDefault();

    internal static ProfileRow? Profile(PortfolioPublicDbContext db, string locale) =>
        (
            from p in db.Profiles
            from t in db
                .ProfileTranslations.Where(t => t.ProfileId == p.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .ProfileTranslations.Where(en => en.ProfileId == p.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby p.Id
            select new ProfileRow(
                p.Name,
                p.BirthDate,
                t.Title ?? en.Title,
                t.Location ?? en.Location,
                t.Description ?? en.Description,
                t.Milestones ?? en.Milestones
            )
        ).FirstOrDefault();

    internal static string? Trajectory(PortfolioPublicDbContext db, string locale) =>
        (
            from p in db.Profiles
            from t in db
                .ProfileTranslations.Where(t => t.ProfileId == p.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .ProfileTranslations.Where(en => en.ProfileId == p.Id && en.Locale == "en")
                .DefaultIfEmpty()
            where t != null || en != null
            orderby p.Id
            select t.Trajectory ?? en.Trajectory
        ).FirstOrDefault();

    internal static List<PageRow> Pages(PortfolioPublicDbContext db, string locale) =>
        (
            from p in db.Pages
            from t in db
                .PageTranslations.Where(t => t.PageId == p.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .PageTranslations.Where(en => en.PageId == p.Id && en.Locale == "en")
                .DefaultIfEmpty()
            where t != null || en != null
            orderby p.Id
            select new PageRow(p.Slug, p.UpdatedAt, t.Fields ?? en.Fields)
        ).ToList();

    internal static List<ContactProfileRow> ContactProfiles(
        PortfolioPublicDbContext db,
        int siteId
    ) =>
        db
            .ContactProfiles.Where(c => c.SiteSettingsId == siteId)
            .OrderBy(c => c.Order == null ? 0 : 1)
            .ThenBy(c => c.Order)
            .ThenBy(c => c.Id)
            .Select(c => new ContactProfileRow(c.Platform, c.Label, c.Url))
            .ToList();

    internal static SiteTranslationRow? SiteTranslation(
        PortfolioPublicDbContext db,
        int siteId,
        string locale
    ) =>
        (
            from t in db.SiteSettingsTranslations
            where t.SiteSettingsId == siteId && t.Locale == locale
            from en in db
                .SiteSettingsTranslations.Where(en =>
                    en.SiteSettingsId == t.SiteSettingsId && en.Locale == "en"
                )
                .DefaultIfEmpty()
            select new SiteTranslationRow(
                t.MaintenanceEyebrow ?? en.MaintenanceEyebrow,
                t.MaintenanceTitle ?? en.MaintenanceTitle,
                t.MaintenanceDescription ?? en.MaintenanceDescription,
                t.Seo ?? en.Seo
            )
        ).FirstOrDefault();

    internal static string? CopyrightTemplate(
        PortfolioPublicDbContext db,
        int siteId,
        string locale
    ) =>
        db
            .SiteSettingsTranslations.Where(t => t.SiteSettingsId == siteId && t.Locale == locale)
            .Select(t => t.CopyrightTemplate)
            .FirstOrDefault();

    internal static List<NavRow> NavItems(PortfolioPublicDbContext db, string locale) =>
        (
            from n in db.NavItems
            from t in db
                .NavItemTranslations.Where(t => t.NavItemId == n.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .NavItemTranslations.Where(en => en.NavItemId == n.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby (n.SidebarGroup == null ? 0 : 1), n.SidebarGroup, n.Order, n.Id
            select new NavRow(
                n.Id,
                n.ParentId,
                n.RouteName,
                n.Placement,
                n.SidebarGroup,
                t.Label ?? en.Label
            )
        ).ToList();
}
