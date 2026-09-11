using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.SitePages;

public partial class PageList
{
    protected override string EntityLabel => "page";

    protected override async Task<List<Page>> LoadEntitiesAsync(
        PortfolioAdminDbContext dbContext
    ) =>
        await dbContext
            .Pages.Include(sitePage => sitePage.Translations)
            .AsNoTracking()
            .OrderBy(sitePage => sitePage.Slug)
            .ToListAsync();

    protected override Task<Page?> FindTrackedAsync(PortfolioAdminDbContext dbContext, int id) =>
        dbContext.Pages.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(Page sitePage) => sitePage.Slug;

    protected override int GetId(Page sitePage) => sitePage.Id;

    protected override string DeleteConfirmDescription(Page entity) =>
        "This permanently removes the page and its translations. This cannot be undone.";

    private static string Locales(Page sitePage) =>
        sitePage.Translations.Count == 0
            ? "—"
            : string.Join(
                ", ",
                sitePage
                    .Translations.Select(translation => translation.Locale)
                    .OrderBy(locale => locale)
            );
}
