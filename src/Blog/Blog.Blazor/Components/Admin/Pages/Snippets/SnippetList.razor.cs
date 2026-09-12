using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.Snippets;

public partial class SnippetList
{
    protected override string EntityLabel => "snippet";

    protected override void SetOrder(Snippet entity, int order) => entity.Order = order;

    protected override async Task<List<Snippet>> LoadEntitiesAsync(BlogAdminDbContext dbContext) =>
        await dbContext
            .Snippets.Include(snippet => snippet.Translations)
            .Include(snippet => snippet.Files)
            .AsNoTracking()
            .OrderBy(snippet => snippet.Order)
            .ThenBy(snippet => snippet.Slug)
            .ToListAsync();

    protected override Task<Snippet?> FindTrackedAsync(BlogAdminDbContext dbContext, int id) =>
        dbContext.Snippets.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(Snippet snippet) =>
        TranslationLookup.Resolve(
            snippet.Translations,
            translation => translation.Locale,
            translation => translation.Title,
            "en"
        ) ?? snippet.Slug;

    protected override int GetId(Snippet snippet) => snippet.Id;

    protected override string DeleteConfirmDescription(Snippet entity) =>
        "This permanently removes the snippet, its translations and its files. This cannot be undone.";
}
