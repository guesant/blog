using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.Credits;

public partial class CreditList
{
    protected override string EntityLabel => "credit";

    protected override void SetOrder(CreditEntry entity, int order) => entity.Order = order;

    protected override async Task<List<CreditEntry>> LoadEntitiesAsync(
        BlogAdminDbContext dbContext
    ) =>
        await dbContext
            .CreditEntries.Include(credit => credit.Translations)
            .AsNoTracking()
            .OrderBy(credit => credit.Category)
            .ThenBy(credit => credit.Order)
            .ToListAsync();

    protected override Task<CreditEntry?> FindTrackedAsync(BlogAdminDbContext dbContext, int id) =>
        dbContext.CreditEntries.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(CreditEntry credit) =>
        TranslationLookup.Resolve(
            credit.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? credit.Category;

    protected override int GetId(CreditEntry credit) => credit.Id;

    protected override string DeleteConfirmDescription(CreditEntry entity) =>
        "This permanently removes the credit and its translations. This cannot be undone.";
}
