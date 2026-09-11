using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Findings;

public partial class FindingList
{
    protected override string EntityLabel => "finding";

    protected override void SetOrder(Resource entity, int order) => entity.Order = order;

    protected override async Task<List<Resource>> LoadEntitiesAsync(
        PortfolioAdminDbContext dbContext
    ) =>
        await dbContext
            .Resources.Include(resource => resource.Translations)
            .AsNoTracking()
            .OrderBy(resource => resource.Order)
            .ThenBy(resource => resource.Slug)
            .ToListAsync();

    protected override Task<Resource?> FindTrackedAsync(
        PortfolioAdminDbContext dbContext,
        int id
    ) => dbContext.Resources.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(Resource resource) =>
        TranslationLookup.Resolve(
            resource.Translations,
            translation => translation.Locale,
            translation => translation.Title,
            "en"
        ) ?? resource.Slug;

    protected override int GetId(Resource resource) => resource.Id;

    protected override string DeleteConfirmDescription(Resource entity) =>
        "This permanently removes the finding, its translations, links, identifiers and topic links. This cannot be undone.";

    protected override async Task RemoveAsync(PortfolioAdminDbContext dbContext, Resource tracked)
    {
        dbContext.Resources.Remove(tracked);

        var topicables = await dbContext
            .Topicables.Where(topicable =>
                topicable.TopicableType == "finding" && topicable.TopicableId == tracked.Id
            )
            .ToListAsync();
        dbContext.Topicables.RemoveRange(topicables);
    }
}
