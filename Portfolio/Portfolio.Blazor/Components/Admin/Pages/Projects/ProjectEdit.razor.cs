using System.Globalization;
using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Projects;

public partial class ProjectEdit
{
    private static readonly string[] MetricFields = ["label", "value"];

    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private Project _project = new();
    private ProjectTranslation _translationEn = new() { Locale = "en" };
    private ProjectTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private List<Technology> _allTechnologies = [];
    private HashSet<int> _selectedTechnologyIds = [];

    private static string TechnologyDisplayName(Technology technology) =>
        TranslationLookup.Resolve(
            technology.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? technology.Slug;

    private string _activeLocale = "en";

    private EditContext _projectEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "project";
    protected override string ListRoute => "/admin/projects";

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
            var project = await dbContext
                .Projects.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.ProjectTechnologies)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (project is null)
            {
                ToastService.Error("Project not found.");
                Navigation.NavigateTo("/admin/projects");
                return;
            }

            _project = project;
            _translationEn =
                project.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new ProjectTranslation { ProjectId = project.Id, Locale = "en" };
            _translationPtBr =
                project.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new ProjectTranslation { ProjectId = project.Id, Locale = "pt-BR" };
            _selectedTechnologyIds = project
                .ProjectTechnologies.Select(projectTechnology => projectTechnology.TechnologyId)
                .ToHashSet();
        }

        _projectEditContext = new EditContext(_project);
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
            var project = await dbContext
                .Projects.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.ProjectTechnologies)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyProjectFields(project, _project);
            ApplyTranslation(project, "en", _translationEn, englishHasContent);
            ApplyTranslation(project, "pt-BR", _translationPtBr, portugueseHasContent);

            dbContext.ProjectTechnologies.RemoveRange(project.ProjectTechnologies);
            for (var index = 0; index < orderedSelectedTechnologyIds.Count; index++)
            {
                dbContext.ProjectTechnologies.Add(
                    new ProjectTechnology
                    {
                        ProjectId = project.Id,
                        TechnologyId = orderedSelectedTechnologyIds[index],
                        Order = index,
                    }
                );
            }
        }
        else
        {
            var project = new Project();
            ApplyProjectFields(project, _project);

            if (englishHasContent)
            {
                project.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                project.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            for (var index = 0; index < orderedSelectedTechnologyIds.Count; index++)
            {
                project.ProjectTechnologies.Add(
                    new ProjectTechnology
                    {
                        TechnologyId = orderedSelectedTechnologyIds[index],
                        Order = index,
                    }
                );
            }

            project.Order = await NextOrderAsync(dbContext.Projects, entity => entity.Order);
            project.PublicId = PublicIds.New();
            dbContext.Projects.Add(project);
        }
    }

    private static void ApplyProjectFields(Project target, Project source)
    {
        target.Slug = source.Slug;
        target.Hidden = source.Hidden;
        target.Order = source.Order;
        target.Href = source.Href;
        target.External = source.External;
        target.Nda = source.Nda;
        target.PublishedAt = source.PublishedAt;
        target.ShowHistory = source.ShowHistory;
    }

    private static void ApplyTranslation(
        Project project,
        string locale,
        ProjectTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = project.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            project.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Name = source.Name;
        existing.Purpose = source.Purpose;
        existing.Problem = source.Problem;
        existing.CurrentFocus = source.CurrentFocus;
        existing.Status = source.Status;
        existing.Metrics = source.Metrics;
        existing.Body = source.Body;
        existing.Seo = source.Seo;
    }

    private static ProjectTranslation CloneTranslation(ProjectTranslation source, string locale) =>
        new()
        {
            Locale = locale,
            Name = source.Name,
            Purpose = source.Purpose,
            Problem = source.Problem,
            CurrentFocus = source.CurrentFocus,
            Status = source.Status,
            Metrics = source.Metrics,
            Body = source.Body,
            Seo = source.Seo,
        };
}
