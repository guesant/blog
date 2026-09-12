using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.Topics;

public partial class TopicList
{
    protected override string EntityLabel => "topic";

    protected override void SetOrder(Topic entity, int order) => entity.Order = order;

    protected override async Task<List<Topic>> LoadEntitiesAsync(BlogAdminDbContext dbContext) =>
        await dbContext
            .Topics.Include(topic => topic.Translations)
            .AsNoTracking()
            .OrderBy(topic => topic.Order)
            .ToListAsync();

    protected override Task<Topic?> FindTrackedAsync(BlogAdminDbContext dbContext, int id) =>
        dbContext.Topics.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(Topic topic) =>
        TranslationLookup.Resolve(
            topic.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? topic.Slug;

    protected override int GetId(Topic topic) => topic.Id;

    protected override string DeleteConfirmDescription(Topic entity) =>
        "This permanently removes the topic and its translations. This cannot be undone.";
}
