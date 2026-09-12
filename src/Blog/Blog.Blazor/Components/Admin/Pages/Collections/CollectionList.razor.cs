using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.Collections;

public partial class CollectionList
{
    protected override string EntityLabel => "collection";

    protected override void SetOrder(ReferenceCollection entity, int order) => entity.Order = order;

    protected override async Task<List<ReferenceCollection>> LoadEntitiesAsync(
        BlogAdminDbContext dbContext
    ) =>
        await dbContext
            .ReferenceCollections.Include(collection => collection.Translations)
            .Include(collection => collection.Items)
            .AsNoTracking()
            .OrderBy(collection => collection.Order)
            .ThenBy(collection => collection.Slug)
            .ToListAsync();

    protected override Task<ReferenceCollection?> FindTrackedAsync(
        BlogAdminDbContext dbContext,
        int id
    ) => dbContext.ReferenceCollections.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(ReferenceCollection collection) =>
        TranslationLookup.Resolve(
            collection.Translations,
            translation => translation.Locale,
            translation => translation.Title,
            "en"
        ) ?? collection.Slug;

    protected override int GetId(ReferenceCollection collection) => collection.Id;

    protected override string DeleteConfirmDescription(ReferenceCollection entity) =>
        "This permanently removes the collection, its translations and its items. This cannot be undone.";
}
