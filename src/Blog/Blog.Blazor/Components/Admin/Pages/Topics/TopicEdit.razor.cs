using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.Topics;

public partial class TopicEdit
{
    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private Topic _topic = new();
    private TopicTranslation _translationEn = new() { Locale = "en" };
    private TopicTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private string _activeLocale = "en";

    private EditContext _topicEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "topic";
    protected override string ListRoute => "/admin/topics";

    protected override async Task LoadAsync(BlogAdminDbContext dbContext)
    {
        if (Id is int id)
        {
            var topic = await dbContext
                .Topics.Include(candidate => candidate.Translations)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (topic is null)
            {
                ToastService.Error("Topic not found.");
                Navigation.NavigateTo("/admin/topics");
                return;
            }

            _topic = topic;
            _translationEn =
                topic.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new TopicTranslation { TopicId = topic.Id, Locale = "en" };
            _translationPtBr =
                topic.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new TopicTranslation { TopicId = topic.Id, Locale = "pt-BR" };
        }

        _topicEditContext = new EditContext(_topic);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
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

    protected override async Task ApplyChangesAsync(BlogAdminDbContext dbContext)
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Name);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Name);

        if (Id is int id)
        {
            var topic = await dbContext
                .Topics.Include(candidate => candidate.Translations)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyTopicFields(topic, _topic);
            ApplyTranslation(topic, "en", _translationEn, englishHasContent);
            ApplyTranslation(topic, "pt-BR", _translationPtBr, portugueseHasContent);
        }
        else
        {
            var topic = new Topic();
            ApplyTopicFields(topic, _topic);

            if (englishHasContent)
            {
                topic.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                topic.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            topic.Order = await NextOrderAsync(dbContext.Topics, entity => entity.Order);
            topic.PublicId = PublicIds.New();
            dbContext.Topics.Add(topic);
        }
    }

    private static void ApplyTopicFields(Topic target, Topic source)
    {
        target.Slug = source.Slug;
        target.Order = source.Order;
        target.Hidden = source.Hidden;
    }

    private static void ApplyTranslation(
        Topic topic,
        string locale,
        TopicTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = topic.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            topic.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Name = source.Name;
    }

    private static TopicTranslation CloneTranslation(TopicTranslation source, string locale) =>
        new() { Locale = locale, Name = source.Name };
}
