using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using ResumeEntity = Portfolio.Blazor.Data.Entities.Resume;
using ResumeTranslationEntity = Portfolio.Blazor.Data.Entities.ResumeTranslation;

namespace Portfolio.Blazor.Components.Admin.Pages.Resume;

public partial class ResumeEdit
{
    private static readonly string[] Proficiencies =
    [
        "native",
        "fluent",
        "advanced",
        "intermediate",
        "basic",
    ];

    private static readonly string[] LeadershipFields =
    [
        "role",
        "organization",
        "period",
        "highlights:list",
        "includeInResume:bool",
        "hidden:bool",
    ];
    private static readonly string[] EducationFields =
    [
        "institution",
        "degree",
        "location",
        "period",
        "hidden:bool",
    ];
    private static readonly string[] DescribedFields =
    [
        "name",
        "issuer",
        "description",
        "period",
        "includeInPdf:bool",
        "hidden:bool",
    ];
    private static readonly string[] TechnicalProductionFields =
    [
        "name",
        "kind",
        "description",
        "url",
        "period",
        "includeInPdf:bool",
        "hidden:bool",
    ];
    private static readonly string[] EventFields =
    [
        "name",
        "role",
        "location",
        "period",
        "includeInPdf:bool",
        "hidden:bool",
    ];

    public sealed class ResumeSkillFormModel
    {
        public int TopicId { get; set; }
        public string TopicIdText
        {
            get => TopicId == 0 ? string.Empty : TopicId.ToString(CultureInfo.InvariantCulture);
            set =>
                TopicId = string.IsNullOrWhiteSpace(value)
                    ? 0
                    : int.Parse(value, CultureInfo.InvariantCulture);
        }
        public HashSet<int> SelectedTechnologyIds { get; set; } = [];
    }

    public sealed class ResumeLanguageFormModel
    {
        public int LanguageId { get; set; }
        public string LanguageIdText
        {
            get =>
                LanguageId == 0 ? string.Empty : LanguageId.ToString(CultureInfo.InvariantCulture);
            set =>
                LanguageId = string.IsNullOrWhiteSpace(value)
                    ? 0
                    : int.Parse(value, CultureInfo.InvariantCulture);
        }
        public string Proficiency { get; set; } = string.Empty;
    }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private ResumeEntity _resume = new();
    private ResumeTranslationEntity _translationEn = new() { Locale = "en" };
    private ResumeTranslationEntity _translationPtBr = new() { Locale = "pt-BR" };
    private List<ResumeSkillFormModel> _skills = [];
    private List<ResumeLanguageFormModel> _languages = [];
    private List<(int LanguageId, string Proficiency)> _initialLanguageRows = [];
    private List<Topic> _allTopics = [];
    private List<Technology> _allTechnologies = [];
    private List<Language> _allLanguages = [];
    private List<CaseStudy> _allCaseStudies = [];
    private HashSet<int> _selectedCaseStudyIds = [];
    private List<int> _initialOrderedCaseStudyIds = [];
    private string _activeLocale = "en";

    private EditContext _resumeEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    protected override string EntityLabel => "resume";
    protected override string ListRoute => "/admin/resume";

    private IReadOnlyList<SiteSelectOption> TopicOptions =>
        _allTopics
            .OrderBy(topic => topic.Order)
            .ThenBy(topic => topic.Id)
            .Select(topic => new SiteSelectOption(
                topic.Id.ToString(CultureInfo.InvariantCulture),
                TopicDisplayName(topic)
            ))
            .ToArray();

    private IReadOnlyList<SiteSelectOption> LanguageOptions =>
        _allLanguages
            .OrderBy(language => language.Order)
            .ThenBy(language => language.Id)
            .Select(language => new SiteSelectOption(
                language.Id.ToString(CultureInfo.InvariantCulture),
                LanguageDisplayName(language)
            ))
            .ToArray();

    private static string TopicDisplayName(Topic topic) =>
        TranslationLookup.Resolve(
            topic.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? topic.Slug;

    private static string LanguageDisplayName(Language language) =>
        TranslationLookup.Resolve(
            language.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? language.Slug;

    private static string TechnologyDisplayName(Technology technology) =>
        TranslationLookup.Resolve(
            technology.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? technology.Slug;

    private static string CaseStudyDisplayName(CaseStudy caseStudy) =>
        TranslationLookup.Resolve(
            caseStudy.Translations,
            translation => translation.Locale,
            translation => translation.Title,
            "en"
        ) ?? caseStudy.Slug;

    protected override async Task LoadAsync(PortfolioAdminDbContext dbContext)
    {
        _allTopics = await dbContext
            .Topics.Include(topic => topic.Translations)
            .AsNoTracking()
            .Where(topic => topic.Kind == "skill")
            .OrderBy(topic => topic.Order)
            .ThenBy(topic => topic.Id)
            .ToListAsync();

        _allTechnologies = await dbContext
            .Technologies.Include(technology => technology.Translations)
            .AsNoTracking()
            .OrderBy(technology => technology.Order)
            .ThenBy(technology => technology.Id)
            .ToListAsync();

        _allLanguages = await dbContext
            .Languages.Include(language => language.Translations)
            .AsNoTracking()
            .OrderBy(language => language.Order)
            .ThenBy(language => language.Id)
            .ToListAsync();

        _allCaseStudies = await dbContext
            .CaseStudies.Include(caseStudy => caseStudy.Translations)
            .AsNoTracking()
            .OrderBy(caseStudy => caseStudy.Order)
            .ThenBy(caseStudy => caseStudy.Id)
            .ToListAsync();

        var resume = await dbContext
            .Resumes.Include(candidate => candidate.Translations)
            .Include(candidate => candidate.Skills)
                .ThenInclude(skill => skill.SkillTechnologies)
            .Include(candidate => candidate.Languages)
            .Include(candidate => candidate.SelectedCases)
            .AsNoTracking()
            .OrderBy(candidate => candidate.Id)
            .FirstOrDefaultAsync();

        if (resume is null)
        {
            ToastService.Error("Resume not found.");
            Navigation.NavigateTo("/admin");
            return;
        }

        _resume = resume;
        _translationEn =
            resume.Translations.FirstOrDefault(translation => translation.Locale == "en")
            ?? new ResumeTranslationEntity { ResumeId = resume.Id, Locale = "en" };
        _translationPtBr =
            resume.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
            ?? new ResumeTranslationEntity { ResumeId = resume.Id, Locale = "pt-BR" };

        _skills = resume
            .Skills.OrderBy(skill => skill.Order)
            .ThenBy(skill => skill.Id)
            .Select(skill => new ResumeSkillFormModel
            {
                TopicId = skill.TopicId,
                SelectedTechnologyIds = skill
                    .SkillTechnologies.Select(skillTechnology => skillTechnology.TechnologyId)
                    .ToHashSet(),
            })
            .ToList();

        _languages = resume
            .Languages.OrderBy(language => language.Order)
            .ThenBy(language => language.Id)
            .Select(language => new ResumeLanguageFormModel
            {
                LanguageId = language.LanguageId,
                Proficiency = language.Proficiency ?? string.Empty,
            })
            .ToList();
        _initialLanguageRows = _languages
            .Select(language => (language.LanguageId, language.Proficiency))
            .ToList();

        _initialOrderedCaseStudyIds = resume
            .SelectedCases.OrderBy(selected => selected.Order)
            .Select(selected => selected.CaseStudyId)
            .ToList();
        _selectedCaseStudyIds = _initialOrderedCaseStudyIds.ToHashSet();

        _resumeEditContext = new EditContext(_resume);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
    }

    private void HandleAddSkill() => _skills.Add(new ResumeSkillFormModel());

    private void HandleRemoveSkill(int index) => _skills.RemoveAt(index);

    private static Task HandleSkillTechnologiesChanged(
        ResumeSkillFormModel skillRow,
        HashSet<int> selected
    )
    {
        skillRow.SelectedTechnologyIds = selected;
        return Task.CompletedTask;
    }

    private void HandleAddLanguage() => _languages.Add(new ResumeLanguageFormModel());

    private void HandleRemoveLanguage(int index) => _languages.RemoveAt(index);

    private Task HandleSelectedCaseStudiesChanged(HashSet<int> selected)
    {
        _selectedCaseStudyIds = selected;
        return Task.CompletedTask;
    }

    protected override Task<bool> ValidateAsync()
    {
        if (!_enEditContext.Validate() || !_ptEditContext.Validate())
        {
            return Task.FromResult(false);
        }

        if (_skills.Any(skillRow => skillRow.TopicId == 0))
        {
            SaveError = "Every skill needs a topic.";
            return Task.FromResult(false);
        }

        if (_languages.Any(languageRow => languageRow.LanguageId == 0))
        {
            SaveError = "Every language needs a language selected.";
            return Task.FromResult(false);
        }

        return Task.FromResult(true);
    }

    protected override async Task ApplyChangesAsync(PortfolioAdminDbContext dbContext)
    {
        // IMPORTANT: newly checked case studies are appended after the ones
        // that were already selected, in their own site-wide order — the
        // checklist only exposes a HashSet, with no way to express a custom
        // resume-specific ranking. Falling back to sorting every selected id
        // by CaseStudy.Order on every save would silently reshuffle the whole
        // "selected work" sequence whenever any single case study is toggled,
        // discarding whatever curation order the resume previously had.
        var orderedSelectedCaseStudyIds = _initialOrderedCaseStudyIds
            .Where(caseStudyId => _selectedCaseStudyIds.Contains(caseStudyId))
            .Concat(
                _allCaseStudies
                    .OrderBy(caseStudy => caseStudy.Order)
                    .ThenBy(caseStudy => caseStudy.Id)
                    .Select(caseStudy => caseStudy.Id)
                    .Where(caseStudyId =>
                        _selectedCaseStudyIds.Contains(caseStudyId)
                        && !_initialOrderedCaseStudyIds.Contains(caseStudyId)
                    )
            )
            .ToList();

        var currentLanguageRows = _languages
            .Select(language => (language.LanguageId, language.Proficiency))
            .ToList();

        var resume = await dbContext
            .Resumes.Include(candidate => candidate.Translations)
            .Include(candidate => candidate.Skills)
                .ThenInclude(skill => skill.SkillTechnologies)
            .Include(candidate => candidate.Languages)
            .Include(candidate => candidate.SelectedCases)
            .FirstAsync(candidate => candidate.Id == _resume.Id);

        ApplyTranslation(resume, "en", _translationEn);
        ApplyTranslation(resume, "pt-BR", _translationPtBr);

        // IMPORTANT: skills are always fully rewritten on save, unlike
        // languages and selected cases below. Each skill also owns a
        // per-skill technology pivot, so a precise diff would need to
        // reconcile two nested collections at once; a full
        // RemoveRange+Add is simpler and this form already replaces
        // the whole skill list on every save regardless.
        dbContext.ResumeSkills.RemoveRange(resume.Skills);
        for (var index = 0; index < _skills.Count; index++)
        {
            var skillRow = _skills[index];
            var skill = new ResumeSkill
            {
                ResumeId = resume.Id,
                TopicId = skillRow.TopicId,
                Order = index,
            };
            foreach (var technologyId in skillRow.SelectedTechnologyIds)
            {
                skill.SkillTechnologies.Add(
                    new ResumeSkillTechnology { TechnologyId = technologyId }
                );
            }

            dbContext.ResumeSkills.Add(skill);
        }

        if (!currentLanguageRows.SequenceEqual(_initialLanguageRows))
        {
            dbContext.ResumeLanguages.RemoveRange(resume.Languages);
            for (var index = 0; index < currentLanguageRows.Count; index++)
            {
                dbContext.ResumeLanguages.Add(
                    new ResumeLanguage
                    {
                        ResumeId = resume.Id,
                        LanguageId = currentLanguageRows[index].LanguageId,
                        Proficiency = NullIfBlank(currentLanguageRows[index].Proficiency),
                        Order = index,
                    }
                );
            }
        }

        if (!orderedSelectedCaseStudyIds.SequenceEqual(_initialOrderedCaseStudyIds))
        {
            dbContext.ResumeSelectedCases.RemoveRange(resume.SelectedCases);
            for (var index = 0; index < orderedSelectedCaseStudyIds.Count; index++)
            {
                dbContext.ResumeSelectedCases.Add(
                    new ResumeSelectedCase
                    {
                        ResumeId = resume.Id,
                        CaseStudyId = orderedSelectedCaseStudyIds[index],
                        Order = index,
                    }
                );
            }
        }

        // IMPORTANT: languages and selected cases are only rewritten when
        // they differ from these baselines, so a second save in the same
        // page load must move the baselines forward to what was just
        // applied here — otherwise a later edit that happens to match the
        // original page-load snapshot (e.g. remove then re-add the same
        // language) would compare equal to the stale baseline and silently
        // skip writing, even though the two saves disagree with each other.
        _initialLanguageRows = currentLanguageRows;
        _initialOrderedCaseStudyIds = orderedSelectedCaseStudyIds;
    }

    private static void ApplyTranslation(
        ResumeEntity resume,
        string locale,
        ResumeTranslationEntity source
    )
    {
        var existing = resume.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            resume.Translations.Add(
                new ResumeTranslationEntity
                {
                    Locale = locale,
                    Summary = source.Summary,
                    Leadership = source.Leadership,
                    Education = source.Education,
                    Certificates = source.Certificates,
                    Certifications = source.Certifications,
                    Publications = source.Publications,
                    Recommendations = source.Recommendations,
                    TechnicalProductions = source.TechnicalProductions,
                    Events = source.Events,
                    Awards = source.Awards,
                }
            );
            return;
        }

        existing.Summary = source.Summary;
        existing.Leadership = source.Leadership;
        existing.Education = source.Education;
        existing.Certificates = source.Certificates;
        existing.Certifications = source.Certifications;
        existing.Publications = source.Publications;
        existing.Recommendations = source.Recommendations;
        existing.TechnicalProductions = source.TechnicalProductions;
        existing.Events = source.Events;
        existing.Awards = source.Awards;
    }
}
