using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.SitePages;

public partial class PageEdit
{
    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private Page _page = new();
    private PageTranslation _translationEn = new() { Locale = "en" };
    private PageTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private List<CaseStudy> _allCaseStudies = [];
    private List<Project> _allProjects = [];
    private List<Writing> _allWritings = [];
    private HashSet<int> _selectedCaseStudyIds = [];
    private HashSet<int> _selectedProjectIds = [];
    private HashSet<int> _selectedWritingIds = [];
    private List<int> _initialOrderedCaseStudyIds = [];
    private List<int> _initialOrderedProjectIds = [];
    private List<int> _initialOrderedWritingIds = [];
    private string _activeLocale = "en";

    private EditContext _pageEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "page";
    protected override string ListRoute => "/admin/pages";

    private bool IsPortfolioPage => _page.Slug == "portfolio";

    private static string CaseStudyDisplayName(CaseStudy caseStudy) =>
        TranslationLookup.Resolve(
            caseStudy.Translations,
            translation => translation.Locale,
            translation => translation.Title,
            "en"
        ) ?? caseStudy.Slug;

    private static string ProjectDisplayName(Project project) =>
        TranslationLookup.Resolve(
            project.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? project.Slug;

    private static string WritingDisplayName(Writing writing) =>
        TranslationLookup.Resolve(
            writing.Translations,
            translation => translation.Locale,
            translation => translation.Title,
            "en"
        ) ?? writing.Slug;

    protected override async Task LoadAsync(BlogAdminDbContext dbContext)
    {
        _allCaseStudies = await dbContext
            .CaseStudies.Include(caseStudy => caseStudy.Translations)
            .AsNoTracking()
            .OrderBy(caseStudy => caseStudy.Order)
            .ThenBy(caseStudy => caseStudy.Id)
            .ToListAsync();

        _allProjects = await dbContext
            .Projects.Include(project => project.Translations)
            .AsNoTracking()
            .OrderBy(project => project.Order)
            .ThenBy(project => project.Id)
            .ToListAsync();

        _allWritings = await dbContext
            .Writings.Include(writing => writing.Translations)
            .AsNoTracking()
            .OrderByDescending(writing => writing.DateIso)
            .ThenBy(writing => writing.Id)
            .ToListAsync();

        if (Id is int id)
        {
            var page = await dbContext
                .Pages.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.FeaturedCases)
                .Include(candidate => candidate.FeaturedProjects)
                .Include(candidate => candidate.FeaturedWritings)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (page is null)
            {
                ToastService.Error("Page not found.");
                Navigation.NavigateTo("/admin/pages");
                return;
            }

            _page = page;
            _translationEn =
                page.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new PageTranslation { PageId = page.Id, Locale = "en" };
            _translationPtBr =
                page.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new PageTranslation { PageId = page.Id, Locale = "pt-BR" };
            _initialOrderedCaseStudyIds = page
                .FeaturedCases.OrderBy(featured => featured.Order)
                .Select(featured => featured.CaseStudyId)
                .ToList();
            _initialOrderedProjectIds = page
                .FeaturedProjects.OrderBy(featured => featured.Order)
                .Select(featured => featured.ProjectId)
                .ToList();
            _initialOrderedWritingIds = page
                .FeaturedWritings.OrderBy(featured => featured.Order)
                .Select(featured => featured.WritingId)
                .ToList();
            _selectedCaseStudyIds = _initialOrderedCaseStudyIds.ToHashSet();
            _selectedProjectIds = _initialOrderedProjectIds.ToHashSet();
            _selectedWritingIds = _initialOrderedWritingIds.ToHashSet();
        }

        _pageEditContext = new EditContext(_page);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
    }

    private Task HandleSelectedCaseStudiesChanged(HashSet<int> selected)
    {
        _selectedCaseStudyIds = selected;
        return Task.CompletedTask;
    }

    private Task HandleSelectedProjectsChanged(HashSet<int> selected)
    {
        _selectedProjectIds = selected;
        return Task.CompletedTask;
    }

    private Task HandleSelectedWritingsChanged(HashSet<int> selected)
    {
        _selectedWritingIds = selected;
        return Task.CompletedTask;
    }

    protected override Task<bool> ValidateAsync()
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Fields);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Fields);
        var englishValid = !englishHasContent || _enEditContext.Validate();
        var portugueseValid = !portugueseHasContent || _ptEditContext.Validate();

        if (!englishValid || !portugueseValid)
        {
            return Task.FromResult(false);
        }

        if (!englishHasContent && !portugueseHasContent)
        {
            SaveError = "Provide fields JSON in at least one language.";
            return Task.FromResult(false);
        }

        return Task.FromResult(true);
    }

    protected override async Task ApplyChangesAsync(BlogAdminDbContext dbContext)
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Fields);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Fields);
        var isPortfolioPage = IsPortfolioPage;

        var orderedSelectedCaseStudyIds = _allCaseStudies
            .OrderBy(caseStudy => caseStudy.Order)
            .ThenBy(caseStudy => caseStudy.Id)
            .Select(caseStudy => caseStudy.Id)
            .Where(caseStudyId => _selectedCaseStudyIds.Contains(caseStudyId))
            .ToList();

        var orderedSelectedProjectIds = _allProjects
            .OrderBy(project => project.Order)
            .ThenBy(project => project.Id)
            .Select(project => project.Id)
            .Where(projectId => _selectedProjectIds.Contains(projectId))
            .ToList();

        var orderedSelectedWritingIds = _allWritings
            .OrderByDescending(writing => writing.DateIso)
            .ThenBy(writing => writing.Id)
            .Select(writing => writing.Id)
            .Where(writingId => _selectedWritingIds.Contains(writingId))
            .ToList();

        if (Id is int id)
        {
            var page = await dbContext
                .Pages.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.FeaturedCases)
                .Include(candidate => candidate.FeaturedProjects)
                .Include(candidate => candidate.FeaturedWritings)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyPageFields(page, _page);
            ApplyTranslation(page, "en", _translationEn, englishHasContent);
            ApplyTranslation(page, "pt-BR", _translationPtBr, portugueseHasContent);

            if (isPortfolioPage)
            {
                ApplyFeaturedPivots(
                    dbContext,
                    page,
                    orderedSelectedCaseStudyIds,
                    orderedSelectedProjectIds,
                    orderedSelectedWritingIds,
                    _initialOrderedCaseStudyIds,
                    _initialOrderedProjectIds,
                    _initialOrderedWritingIds
                );
            }
        }
        else
        {
            var page = new Page();
            ApplyPageFields(page, _page);

            if (englishHasContent)
            {
                page.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                page.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            if (isPortfolioPage)
            {
                for (var index = 0; index < orderedSelectedCaseStudyIds.Count; index++)
                {
                    page.FeaturedCases.Add(
                        new PageFeaturedCase
                        {
                            CaseStudyId = orderedSelectedCaseStudyIds[index],
                            Order = index,
                        }
                    );
                }

                for (var index = 0; index < orderedSelectedProjectIds.Count; index++)
                {
                    page.FeaturedProjects.Add(
                        new PageFeaturedProject
                        {
                            ProjectId = orderedSelectedProjectIds[index],
                            Order = index,
                        }
                    );
                }

                for (var index = 0; index < orderedSelectedWritingIds.Count; index++)
                {
                    page.FeaturedWritings.Add(
                        new PageFeaturedWriting
                        {
                            WritingId = orderedSelectedWritingIds[index],
                            Order = index,
                        }
                    );
                }
            }

            dbContext.Pages.Add(page);
        }
    }

    // IMPORTANT: only rewrite a pivot table whose selection actually changed.
    // The three featured lists are edited independently in the same form, and
    // always re-writing all three on every save would renumber the `order`
    // column of untouched lists for no reason (harmless to the public query,
    // which only reads relative order, but a needless diff on every save).
    private static void ApplyFeaturedPivots(
        BlogAdminDbContext dbContext,
        Page page,
        List<int> orderedSelectedCaseStudyIds,
        List<int> orderedSelectedProjectIds,
        List<int> orderedSelectedWritingIds,
        List<int> initialOrderedCaseStudyIds,
        List<int> initialOrderedProjectIds,
        List<int> initialOrderedWritingIds
    )
    {
        if (!orderedSelectedCaseStudyIds.SequenceEqual(initialOrderedCaseStudyIds))
        {
            dbContext.PageFeaturedCases.RemoveRange(page.FeaturedCases);
            for (var index = 0; index < orderedSelectedCaseStudyIds.Count; index++)
            {
                dbContext.PageFeaturedCases.Add(
                    new PageFeaturedCase
                    {
                        PageId = page.Id,
                        CaseStudyId = orderedSelectedCaseStudyIds[index],
                        Order = index,
                    }
                );
            }
        }

        if (!orderedSelectedProjectIds.SequenceEqual(initialOrderedProjectIds))
        {
            dbContext.PageFeaturedProjects.RemoveRange(page.FeaturedProjects);
            for (var index = 0; index < orderedSelectedProjectIds.Count; index++)
            {
                dbContext.PageFeaturedProjects.Add(
                    new PageFeaturedProject
                    {
                        PageId = page.Id,
                        ProjectId = orderedSelectedProjectIds[index],
                        Order = index,
                    }
                );
            }
        }

        if (!orderedSelectedWritingIds.SequenceEqual(initialOrderedWritingIds))
        {
            dbContext.PageFeaturedWritings.RemoveRange(page.FeaturedWritings);
            for (var index = 0; index < orderedSelectedWritingIds.Count; index++)
            {
                dbContext.PageFeaturedWritings.Add(
                    new PageFeaturedWriting
                    {
                        PageId = page.Id,
                        WritingId = orderedSelectedWritingIds[index],
                        Order = index,
                    }
                );
            }
        }
    }

    private static void ApplyPageFields(Page target, Page source)
    {
        target.Slug = source.Slug;
        target.Hidden = source.Hidden;
    }

    private static void ApplyTranslation(
        Page page,
        string locale,
        PageTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = page.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            page.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Fields = source.Fields;
    }

    private static PageTranslation CloneTranslation(PageTranslation source, string locale) =>
        new() { Locale = locale, Fields = source.Fields };
}
