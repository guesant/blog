using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Experiments;

public partial class ExperimentEdit
{
    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private Experiment _experiment = new();
    private ExperimentTranslation _translationEn = new() { Locale = "en" };
    private ExperimentTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private List<Technology> _allTechnologies = [];
    private HashSet<int> _selectedTechnologyIds = [];
    private string _activeLocale = "en";

    private EditContext _experimentEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "experiment";
    protected override string ListRoute => "/admin/experiments";

    private static string TechnologyDisplayName(Technology technology) =>
        TranslationLookup.Resolve(
            technology.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? technology.Slug;

    protected override async Task LoadAsync(PortfolioAdminDbContext dbContext)
    {
        _allTechnologies = await dbContext
            .Technologies.Include(technology => technology.Translations)
            .AsNoTracking()
            .OrderBy(technology => technology.Order)
            .ThenBy(technology => technology.Id)
            .ToListAsync();

        if (Id is int id)
        {
            var experiment = await dbContext
                .Experiments.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.ExperimentTechnologies)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (experiment is null)
            {
                ToastService.Error("Experiment not found.");
                Navigation.NavigateTo("/admin/experiments");
                return;
            }

            _experiment = experiment;
            _translationEn =
                experiment.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new ExperimentTranslation { ExperimentId = experiment.Id, Locale = "en" };
            _translationPtBr =
                experiment.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new ExperimentTranslation { ExperimentId = experiment.Id, Locale = "pt-BR" };
            _selectedTechnologyIds = experiment
                .ExperimentTechnologies.Select(experimentTechnology =>
                    experimentTechnology.TechnologyId
                )
                .ToHashSet();
        }

        _experimentEditContext = new EditContext(_experiment);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
    }

    private Task HandleSelectedTechnologiesChanged(HashSet<int> selected)
    {
        _selectedTechnologyIds = selected;
        return Task.CompletedTask;
    }

    protected override Task<bool> ValidateAsync()
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Name);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Name);
        var englishValid = !englishHasContent || _enEditContext.Validate();
        var portugueseValid = !portugueseHasContent || _ptEditContext.Validate();

        if (!englishValid || !portugueseValid)
        {
            return Task.FromResult(false);
        }

        if (!englishHasContent && !portugueseHasContent)
        {
            SaveError = "Provide a name in at least one language.";
            return Task.FromResult(false);
        }

        return Task.FromResult(true);
    }

    protected override async Task ApplyChangesAsync(PortfolioAdminDbContext dbContext)
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Name);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Name);

        var orderedSelectedTechnologyIds = _allTechnologies
            .OrderBy(technology => technology.Order)
            .ThenBy(technology => technology.Id)
            .Select(technology => technology.Id)
            .Where(technologyId => _selectedTechnologyIds.Contains(technologyId))
            .ToList();

        if (Id is int id)
        {
            var experiment = await dbContext
                .Experiments.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.ExperimentTechnologies)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyExperimentFields(experiment, _experiment);
            ApplyTranslation(experiment, "en", _translationEn, englishHasContent);
            ApplyTranslation(experiment, "pt-BR", _translationPtBr, portugueseHasContent);

            dbContext.ExperimentTechnologies.RemoveRange(experiment.ExperimentTechnologies);
            for (var index = 0; index < orderedSelectedTechnologyIds.Count; index++)
            {
                dbContext.ExperimentTechnologies.Add(
                    new ExperimentTechnology
                    {
                        ExperimentId = experiment.Id,
                        TechnologyId = orderedSelectedTechnologyIds[index],
                        Order = index,
                    }
                );
            }
        }
        else
        {
            var experiment = new Experiment();
            ApplyExperimentFields(experiment, _experiment);

            if (englishHasContent)
            {
                experiment.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                experiment.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            for (var index = 0; index < orderedSelectedTechnologyIds.Count; index++)
            {
                experiment.ExperimentTechnologies.Add(
                    new ExperimentTechnology
                    {
                        TechnologyId = orderedSelectedTechnologyIds[index],
                        Order = index,
                    }
                );
            }

            experiment.Order = await NextOrderAsync(dbContext.Experiments, entity => entity.Order);
            experiment.PublicId = PublicIds.New();
            dbContext.Experiments.Add(experiment);
        }
    }

    private static void ApplyExperimentFields(Experiment target, Experiment source)
    {
        target.Slug = source.Slug;
        target.Hidden = source.Hidden;
        target.Order = source.Order;
        target.Href = source.Href;
        target.External = source.External;
        target.PublishedAt = source.PublishedAt;
        target.ShowHistory = source.ShowHistory;
    }

    private static void ApplyTranslation(
        Experiment experiment,
        string locale,
        ExperimentTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = experiment.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            experiment.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Name = source.Name;
        existing.Purpose = source.Purpose;
        existing.Body = source.Body;
        existing.Seo = source.Seo;
    }

    private static ExperimentTranslation CloneTranslation(
        ExperimentTranslation source,
        string locale
    ) =>
        new()
        {
            Locale = locale,
            Name = source.Name,
            Purpose = source.Purpose,
            Body = source.Body,
            Seo = source.Seo,
        };
}
