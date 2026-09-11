using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Projects;

public partial class ProjectList
{
    protected override string EntityLabel => "project";

    protected override void SetOrder(Project entity, int order) => entity.Order = order;

    protected override async Task<List<Project>> LoadEntitiesAsync(
        PortfolioAdminDbContext dbContext
    ) =>
        await dbContext
            .Projects.Include(project => project.Translations)
            .AsNoTracking()
            .OrderBy(project => project.Order)
            .ThenBy(project => project.Slug)
            .ToListAsync();

    protected override Task<Project?> FindTrackedAsync(PortfolioAdminDbContext dbContext, int id) =>
        dbContext.Projects.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(Project project) =>
        TranslationLookup.Resolve(
            project.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? project.Slug;

    protected override int GetId(Project project) => project.Id;

    protected override string DeleteConfirmDescription(Project entity) =>
        "This permanently removes the project, its translations and its technology links. This cannot be undone.";
}
