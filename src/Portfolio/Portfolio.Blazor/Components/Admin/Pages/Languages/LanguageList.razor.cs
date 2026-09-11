using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Languages;

public partial class LanguageList
{
    protected override string EntityLabel => "language";

    protected override void SetOrder(Language entity, int order) => entity.Order = order;

    protected override async Task<List<Language>> LoadEntitiesAsync(
        PortfolioAdminDbContext dbContext
    ) =>
        await dbContext
            .Languages.Include(language => language.Translations)
            .AsNoTracking()
            .OrderBy(language => language.Order)
            .ToListAsync();

    protected override Task<Language?> FindTrackedAsync(
        PortfolioAdminDbContext dbContext,
        int id
    ) => dbContext.Languages.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(Language language) =>
        TranslationLookup.Resolve(
            language.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? language.Slug;

    protected override int GetId(Language language) => language.Id;

    protected override string DeleteConfirmDescription(Language entity) =>
        "This permanently removes the language and its translations. This cannot be undone.";
}
