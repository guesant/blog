using System.Globalization;
using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Writings;

public partial class WritingEdit
{
    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteSelectOption> TypeOptions =
    [
        new SiteSelectOption("article", "Article"),
        new SiteSelectOption("note", "Note"),
        new SiteSelectOption("project-diary", "Project diary"),
    ];

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private Writing _writing = new();
    private DateOnly? DateIsoValue
    {
        get => _writing.DateIso.HasValue ? DateOnly.FromDateTime(_writing.DateIso.Value) : null;
        set => _writing.DateIso = value?.ToDateTime(TimeOnly.MinValue);
    }
    private WritingTranslation _translationEn = new() { Locale = "en" };
    private WritingTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private List<Topic> _allTopics = [];
    private HashSet<int> _selectedTopicIds = [];

    private static string TopicDisplayName(Topic topic) =>
        TranslationLookup.Resolve(
            topic.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? topic.Slug;

    private string _activeLocale = "en";

    private EditContext _writingEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "writing";
    protected override string ListRoute => "/admin/writings";

    protected override async Task LoadAsync(PortfolioAdminDbContext dbContext)
    {
        _allTopics = await dbContext
            .Topics.Include(topic => topic.Translations)
            .AsNoTracking()
            .Where(topic => topic.Kind == "topic")
            .OrderBy(topic => topic.Order)
            .ThenBy(topic => topic.Id)
            .ToListAsync();

        if (Id is int id)
        {
            var writing = await dbContext
                .Writings.Include(candidate => candidate.Translations)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (writing is null)
            {
                ToastService.Error("Writing not found.");
                Navigation.NavigateTo("/admin/writings");
                return;
            }

            _writing = writing;
            _translationEn =
                writing.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new WritingTranslation { WritingId = writing.Id, Locale = "en" };
            _translationPtBr =
                writing.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new WritingTranslation { WritingId = writing.Id, Locale = "pt-BR" };
            _selectedTopicIds = await dbContext
                .Topicables.AsNoTracking()
                .Where(topicable =>
                    topicable.TopicableType == "writing" && topicable.TopicableId == id
                )
                .Select(topicable => topicable.TopicId)
                .ToHashSetAsync();
        }

        _writingEditContext = new EditContext(_writing);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
    }

    private Task HandleSelectedTopicsChanged(HashSet<int> selected)
    {
        _selectedTopicIds = selected;
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

        var orderedSelectedTopicIds = _allTopics
            .OrderBy(topic => topic.Order)
            .ThenBy(topic => topic.Id)
            .Select(topic => topic.Id)
            .Where(topicId => _selectedTopicIds.Contains(topicId))
            .ToList();

        int writingId;

        if (Id is int id)
        {
            var writing = await dbContext
                .Writings.Include(candidate => candidate.Translations)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyWritingFields(writing, _writing);
            ApplyTranslation(writing, "en", _translationEn, englishHasContent);
            ApplyTranslation(writing, "pt-BR", _translationPtBr, portugueseHasContent);

            writingId = writing.Id;
        }
        else
        {
            var writing = new Writing();
            ApplyWritingFields(writing, _writing);

            if (englishHasContent)
            {
                writing.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                writing.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            writing.PublicId = PublicIds.New();
            dbContext.Writings.Add(writing);
            await dbContext.SaveChangesAsync();
            writingId = writing.Id;
        }

        var existingTopicables = await dbContext
            .Topicables.Where(topicable =>
                topicable.TopicableType == "writing" && topicable.TopicableId == writingId
            )
            .ToListAsync();
        dbContext.Topicables.RemoveRange(existingTopicables);

        foreach (var topicId in orderedSelectedTopicIds)
        {
            dbContext.Topicables.Add(
                new Topicable
                {
                    TopicId = topicId,
                    TopicableType = "writing",
                    TopicableId = writingId,
                }
            );
        }
    }

    private static void ApplyWritingFields(Writing target, Writing source)
    {
        target.Slug = source.Slug;
        target.Hidden = source.Hidden;
        target.DateIso = source.DateIso;
        target.ShowHistory = source.ShowHistory;
        target.Type = source.Type;
    }

    private static void ApplyTranslation(
        Writing writing,
        string locale,
        WritingTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = writing.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            writing.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Title = source.Title;
        existing.Excerpt = source.Excerpt;
        existing.ReadingTime = source.ReadingTime;
        existing.Body = source.Body;
        existing.Seo = source.Seo;
    }

    private static WritingTranslation CloneTranslation(WritingTranslation source, string locale) =>
        new()
        {
            Locale = locale,
            Title = source.Title,
            Excerpt = source.Excerpt,
            ReadingTime = source.ReadingTime,
            Body = source.Body,
            Seo = source.Seo,
        };
}
