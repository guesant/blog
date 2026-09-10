using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Experiments;

public partial class ExperimentList
{
    protected override string EntityLabel => "experiment";

    protected override void SetOrder(Experiment entity, int order) => entity.Order = order;

    protected override async Task<List<Experiment>> LoadEntitiesAsync(
        PortfolioAdminDbContext dbContext
    ) =>
        await dbContext
            .Experiments.Include(experiment => experiment.Translations)
            .AsNoTracking()
            .OrderBy(experiment => experiment.Order)
            .ThenBy(experiment => experiment.Slug)
            .ToListAsync();

    protected override Task<Experiment?> FindTrackedAsync(
        PortfolioAdminDbContext dbContext,
        int id
    ) => dbContext.Experiments.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(Experiment experiment) =>
        TranslationLookup.Resolve(
            experiment.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? experiment.Slug;

    protected override int GetId(Experiment experiment) => experiment.Id;

    protected override string DeleteConfirmDescription(Experiment entity) =>
        "This permanently removes the experiment, its translations and its technology links. This cannot be undone.";
}
