using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.Technologies;

public partial class TechnologyList
{
    private bool _blockedByUsage;

    protected override string EntityLabel => "technology";

    protected override void SetOrder(Technology entity, int order) => entity.Order = order;

    protected override async Task<List<Technology>> LoadEntitiesAsync(
        BlogAdminDbContext dbContext
    ) =>
        await dbContext
            .Technologies.Include(technology => technology.Translations)
            .AsNoTracking()
            .OrderBy(technology => technology.Order)
            .ToListAsync();

    protected override Task<Technology?> FindTrackedAsync(BlogAdminDbContext dbContext, int id) =>
        dbContext.Technologies.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(Technology technology) =>
        TranslationLookup.Resolve(
            technology.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? technology.Slug;

    protected override int GetId(Technology technology) => technology.Id;

    protected override string DeleteConfirmDescription(Technology entity) =>
        "This permanently removes the technology and its translations. This cannot be undone.";

    protected override string DeleteErrorMessage =>
        _blockedByUsage
            ? "Não é possível remover: esta tecnologia está em uso."
            : base.DeleteErrorMessage;

    protected override async Task RemoveAsync(BlogAdminDbContext dbContext, Technology tracked)
    {
        _blockedByUsage = false;

        if (await IsTechnologyInUseAsync(dbContext, tracked.Id))
        {
            _blockedByUsage = true;
            throw new InvalidOperationException(
                $"Technology {tracked.Id} is still referenced by other records."
            );
        }

        dbContext.Technologies.Remove(tracked);
    }

    private static async Task<bool> IsTechnologyInUseAsync(
        BlogAdminDbContext dbContext,
        int technologyId
    )
    {
        if (
            await dbContext.ProjectTechnologies.AnyAsync(pivot =>
                pivot.TechnologyId == technologyId
            )
        )
        {
            return true;
        }

        if (
            await dbContext.CaseStudyTechnologies.AnyAsync(pivot =>
                pivot.TechnologyId == technologyId
            )
        )
        {
            return true;
        }

        if (
            await dbContext.ExperimentTechnologies.AnyAsync(pivot =>
                pivot.TechnologyId == technologyId
            )
        )
        {
            return true;
        }

        return await dbContext.ResumeSkillTechnologies.AnyAsync(pivot =>
            pivot.TechnologyId == technologyId
        );
    }
}
