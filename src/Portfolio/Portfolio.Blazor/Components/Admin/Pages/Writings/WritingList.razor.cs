using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Writings;

public partial class WritingList
{
    protected override string EntityLabel => "writing";

    protected override async Task<List<Writing>> LoadEntitiesAsync(
        PortfolioAdminDbContext dbContext
    ) =>
        await dbContext
            .Writings.Include(writing => writing.Translations)
            .AsNoTracking()
            .OrderByDescending(writing => writing.DateIso)
            .ThenBy(writing => writing.Slug)
            .ToListAsync();

    protected override Task<Writing?> FindTrackedAsync(PortfolioAdminDbContext dbContext, int id) =>
        dbContext.Writings.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(Writing writing) =>
        TranslationLookup.Resolve(
            writing.Translations,
            translation => translation.Locale,
            translation => translation.Title,
            "en"
        ) ?? writing.Slug;

    protected override int GetId(Writing writing) => writing.Id;

    protected override string DeleteConfirmDescription(Writing entity) =>
        "This permanently removes the writing, its translations and its topic links. This cannot be undone.";

    protected override async Task RemoveAsync(PortfolioAdminDbContext dbContext, Writing tracked)
    {
        dbContext.Writings.Remove(tracked);

        var topicables = await dbContext
            .Topicables.Where(topicable =>
                topicable.TopicableType == "writing" && topicable.TopicableId == tracked.Id
            )
            .ToListAsync();
        dbContext.Topicables.RemoveRange(topicables);
    }
}
