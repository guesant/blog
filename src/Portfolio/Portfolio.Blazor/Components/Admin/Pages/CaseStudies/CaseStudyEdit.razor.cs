using System.Globalization;
using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.CaseStudies;

public partial class CaseStudyEdit
{
    private static readonly string[] MetricFields = ["label", "value"];

    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private CaseStudy _caseStudy = new();
    private CaseStudyTranslation _translationEn = new() { Locale = "en" };
    private CaseStudyTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private List<Technology> _allTechnologies = [];
    private HashSet<int> _selectedTechnologyIds = [];
    private string _activeLocale = "en";

    private static string TechnologyDisplayName(Technology technology) =>
        TranslationLookup.Resolve(
            technology.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? technology.Slug;

    private EditContext _caseStudyEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "case study";
    protected override string ListRoute => "/admin/case-studies";

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
            var caseStudy = await dbContext
                .CaseStudies.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.CaseStudyTechnologies)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (caseStudy is null)
            {
                ToastService.Error("Case study not found.");
                Navigation.NavigateTo("/admin/case-studies");
                return;
            }

            _caseStudy = caseStudy;
            _translationEn =
                caseStudy.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new CaseStudyTranslation { CaseStudyId = caseStudy.Id, Locale = "en" };
            _translationPtBr =
                caseStudy.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new CaseStudyTranslation { CaseStudyId = caseStudy.Id, Locale = "pt-BR" };
            _selectedTechnologyIds = caseStudy
                .CaseStudyTechnologies.Select(caseStudyTechnology =>
                    caseStudyTechnology.TechnologyId
                )
                .ToHashSet();
        }

        _caseStudyEditContext = new EditContext(_caseStudy);
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
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Title);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Title);
        var englishValid = !englishHasContent || _enEditContext.Validate();
        var portugueseValid = !portugueseHasContent || _ptEditContext.Validate();

        if (!englishValid || !portugueseValid)
        {
            return Task.FromResult(false);
        }

        if (!englishHasContent && !portugueseHasContent)
        {
            SaveError = "Provide a title in at least one language.";
            return Task.FromResult(false);
        }

        return Task.FromResult(true);
    }

    protected override async Task ApplyChangesAsync(PortfolioAdminDbContext dbContext)
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Title);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Title);

        var orderedSelectedTechnologyIds = _allTechnologies
            .OrderBy(technology => technology.Order)
            .ThenBy(technology => technology.Id)
            .Select(technology => technology.Id)
            .Where(technologyId => _selectedTechnologyIds.Contains(technologyId))
            .ToList();

        if (Id is int id)
        {
            var caseStudy = await dbContext
                .CaseStudies.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.CaseStudyTechnologies)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyCaseStudyFields(caseStudy, _caseStudy);
            ApplyTranslation(caseStudy, "en", _translationEn, englishHasContent);
            ApplyTranslation(caseStudy, "pt-BR", _translationPtBr, portugueseHasContent);

            dbContext.CaseStudyTechnologies.RemoveRange(caseStudy.CaseStudyTechnologies);
            for (var index = 0; index < orderedSelectedTechnologyIds.Count; index++)
            {
                dbContext.CaseStudyTechnologies.Add(
                    new CaseStudyTechnology
                    {
                        CaseStudyId = caseStudy.Id,
                        TechnologyId = orderedSelectedTechnologyIds[index],
                        Order = index,
                    }
                );
            }
        }
        else
        {
            var caseStudy = new CaseStudy();
            ApplyCaseStudyFields(caseStudy, _caseStudy);

            if (englishHasContent)
            {
                caseStudy.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                caseStudy.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            for (var index = 0; index < orderedSelectedTechnologyIds.Count; index++)
            {
                caseStudy.CaseStudyTechnologies.Add(
                    new CaseStudyTechnology
                    {
                        TechnologyId = orderedSelectedTechnologyIds[index],
                        Order = index,
                    }
                );
            }

            caseStudy.Order = await NextOrderAsync(dbContext.CaseStudies, entity => entity.Order);
            caseStudy.PublicId = PublicIds.New();
            dbContext.CaseStudies.Add(caseStudy);
        }
    }

    private static void ApplyCaseStudyFields(CaseStudy target, CaseStudy source)
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
        CaseStudy caseStudy,
        string locale,
        CaseStudyTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = caseStudy.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            caseStudy.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Title = source.Title;
        existing.Status = source.Status;
        existing.Meta = source.Meta;
        existing.Summary = source.Summary;
        existing.Context = source.Context;
        existing.Role = source.Role;
        existing.Result = source.Result;
        existing.Metrics = source.Metrics;
        existing.Body = source.Body;
        existing.Seo = source.Seo;
    }

    private static CaseStudyTranslation CloneTranslation(
        CaseStudyTranslation source,
        string locale
    ) =>
        new()
        {
            Locale = locale,
            Title = source.Title,
            Status = source.Status,
            Meta = source.Meta,
            Summary = source.Summary,
            Context = source.Context,
            Role = source.Role,
            Result = source.Result,
            Metrics = source.Metrics,
            Body = source.Body,
            Seo = source.Seo,
        };
}
