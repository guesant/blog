using System.Globalization;
using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.Findings;

public partial class FindingEdit
{
    private static readonly string[] LinkPlatforms =
    [
        "github",
        "gitlab",
        "youtube",
        "arxiv",
        "doi",
        "goodreads",
        "wikipedia",
    ];
    private static readonly string[] LinkPurposes =
    [
        "reading",
        "repository",
        "viewing",
        "official-source",
        "documentation",
    ];
    private static readonly string[] EditorialStates = ["published", "draft", "archived"];
    private static readonly string[] Visibilities = ["public", "unlisted", "private"];

    [Parameter]
    public int? Id { get; set; }

    public sealed class ResourceLinkFormModel
    {
        public string Url { get; set; } = string.Empty;
        public string? Label { get; set; }
        public string? Platform { get; set; }
        public string? Purpose { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsFree { get; set; }
        public int? LanguageId { get; set; }

        public string LanguageIdText
        {
            get => LanguageId?.ToString(CultureInfo.InvariantCulture) ?? string.Empty;
            set =>
                LanguageId = string.IsNullOrWhiteSpace(value)
                    ? null
                    : int.Parse(value, CultureInfo.InvariantCulture);
        }
    }

    public sealed class ResourceIdentifierFormModel
    {
        public string Kind { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }

    private static readonly IReadOnlyList<SiteSelectOption> TypeOptions =
    [
        new SiteSelectOption("article", "Article"),
        new SiteSelectOption("book", "Book"),
        new SiteSelectOption("paper", "Paper"),
        new SiteSelectOption("repo", "Repo"),
        new SiteSelectOption("site", "Site"),
        new SiteSelectOption("docs", "Docs"),
        new SiteSelectOption("tool", "Tool"),
        new SiteSelectOption("course", "Course"),
        new SiteSelectOption("video", "Video"),
        new SiteSelectOption("playlist", "Playlist"),
        new SiteSelectOption("channel", "Channel"),
        new SiteSelectOption("podcast", "Podcast"),
        new SiteSelectOption("film", "Film"),
        new SiteSelectOption("other", "Other"),
    ];

    private static readonly IReadOnlyList<SiteSelectOption> ConsumptionStateOptions =
    [
        new SiteSelectOption("found", "Found"),
        new SiteSelectOption("saved-for-later", "Saved for later"),
        new SiteSelectOption("exploring", "Exploring"),
        new SiteSelectOption("in-progress", "In progress"),
        new SiteSelectOption("completed", "Completed"),
        new SiteSelectOption("abandoned", "Abandoned"),
        new SiteSelectOption("archived", "Archived"),
    ];

    private static readonly IReadOnlyList<SiteSelectOption> RatingOptions =
    [
        new SiteSelectOption("not-rated", "Not rated"),
        new SiteSelectOption("not-recommended", "Not recommended"),
        new SiteSelectOption("interesting", "Interesting"),
        new SiteSelectOption("recommended", "Recommended"),
        new SiteSelectOption("strongly-recommended", "Strongly recommended"),
    ];

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private Resource _resource = new();
    private ResourceTranslation _translationEn = new() { Locale = "en" };
    private ResourceTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private List<ResourceLinkFormModel> _links = [];
    private List<ResourceIdentifierFormModel> _identifiers = [];
    private List<string> _knownIdentifierKinds = [];
    private List<Language> _allLanguages = [];
    private List<Topic> _allTopics = [];
    private HashSet<int> _selectedTopicIds = [];
    private string _activeLocale = "en";

    private EditContext _resourceEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "finding";
    protected override string ListRoute => "/admin/findings";

    private string ResourceLanguageIdValue
    {
        get => _resource.LanguageId?.ToString(CultureInfo.InvariantCulture) ?? string.Empty;
        set => _resource.LanguageId = ParseNullableId(value);
    }

    private string ConsumptionStateValue
    {
        get => _resource.ConsumptionState ?? string.Empty;
        set => _resource.ConsumptionState = NullIfBlank(value);
    }

    private string RatingValue
    {
        get => _resource.Rating ?? string.Empty;
        set => _resource.Rating = NullIfBlank(value);
    }

    private IReadOnlyList<SiteSelectOption> LanguageOptions =>
        _allLanguages
            .Select(language => new SiteSelectOption(
                language.Id.ToString(CultureInfo.InvariantCulture),
                $"{language.Slug} ({language.Code})"
            ))
            .ToArray();

    private static string TopicDisplayName(Topic topic) =>
        TranslationLookup.Resolve(
            topic.Translations,
            translation => translation.Locale,
            translation => translation.Name,
            "en"
        ) ?? topic.Slug;

    protected override async Task LoadAsync(BlogAdminDbContext dbContext)
    {
        _allLanguages = await dbContext
            .Languages.AsNoTracking()
            .OrderBy(language => language.Order)
            .ThenBy(language => language.Id)
            .ToListAsync();

        _allTopics = await dbContext
            .Topics.Include(topic => topic.Translations)
            .AsNoTracking()
            .Where(topic => topic.Kind == "topic")
            .OrderBy(topic => topic.Order)
            .ThenBy(topic => topic.Id)
            .ToListAsync();

        _knownIdentifierKinds = await dbContext
            .ResourceIdentifiers.AsNoTracking()
            .Select(identifier => identifier.Kind)
            .Distinct()
            .OrderBy(kind => kind)
            .ToListAsync();

        if (Id is int id)
        {
            var resource = await dbContext
                .Resources.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.Links)
                .Include(candidate => candidate.Identifiers)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (resource is null)
            {
                ToastService.Error("Finding not found.");
                Navigation.NavigateTo("/admin/findings");
                return;
            }

            _resource = resource;
            _translationEn =
                resource.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new ResourceTranslation { ResourceId = resource.Id, Locale = "en" };
            _translationPtBr =
                resource.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new ResourceTranslation { ResourceId = resource.Id, Locale = "pt-BR" };

            _links = resource
                .Links.OrderBy(link => link.Id)
                .Select(link => new ResourceLinkFormModel
                {
                    Url = link.Url,
                    Label = link.Label,
                    Platform = link.Platform,
                    Purpose = link.Purpose,
                    IsPrimary = link.IsPrimary,
                    IsFree = link.IsFree,
                    LanguageId = link.LanguageId,
                })
                .ToList();

            _identifiers = resource
                .Identifiers.OrderBy(identifier => identifier.Id)
                .Select(identifier => new ResourceIdentifierFormModel
                {
                    Kind = identifier.Kind,
                    Value = identifier.Value,
                })
                .ToList();

            _selectedTopicIds = await dbContext
                .Topicables.AsNoTracking()
                .Where(topicable =>
                    topicable.TopicableType == "finding" && topicable.TopicableId == id
                )
                .Select(topicable => topicable.TopicId)
                .ToHashSetAsync();
        }
        else
        {
            _resource.Visibility = "public";
            _resource.EditorialState = "published";
        }

        _resourceEditContext = new EditContext(_resource);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
    }

    private static int? ParseNullableId(string value) =>
        string.IsNullOrWhiteSpace(value) ? null : int.Parse(value, CultureInfo.InvariantCulture);

    private void HandleAddLink() => _links.Add(new ResourceLinkFormModel());

    private void HandleRemoveLink(int index) => _links.RemoveAt(index);

    private void HandleAddIdentifier() => _identifiers.Add(new ResourceIdentifierFormModel());

    private void HandleRemoveIdentifier(int index) => _identifiers.RemoveAt(index);

    private Task HandleSelectedTopicsChanged(HashSet<int> selected)
    {
        _selectedTopicIds = selected;
        return Task.CompletedTask;
    }

    private static bool LinkHasContent(ResourceLinkFormModel link) =>
        !string.IsNullOrWhiteSpace(link.Url)
        || !string.IsNullOrWhiteSpace(link.Label)
        || !string.IsNullOrWhiteSpace(link.Platform)
        || !string.IsNullOrWhiteSpace(link.Purpose)
        || link.IsPrimary
        || link.IsFree
        || link.LanguageId.HasValue;

    private static bool IdentifierHasContent(ResourceIdentifierFormModel identifier) =>
        !string.IsNullOrWhiteSpace(identifier.Kind) || !string.IsNullOrWhiteSpace(identifier.Value);

    private List<ResourceLinkFormModel> EffectiveLinks => _links.Where(LinkHasContent).ToList();

    private List<ResourceIdentifierFormModel> EffectiveIdentifiers =>
        _identifiers.Where(IdentifierHasContent).ToList();

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

        var effectiveLinks = EffectiveLinks;
        if (effectiveLinks.Any(link => string.IsNullOrWhiteSpace(link.Url)))
        {
            SaveError = "Every link needs a URL.";
            return Task.FromResult(false);
        }

        var effectiveIdentifiers = EffectiveIdentifiers;
        if (
            effectiveIdentifiers.Any(identifier =>
                string.IsNullOrWhiteSpace(identifier.Kind)
                || string.IsNullOrWhiteSpace(identifier.Value)
            )
        )
        {
            SaveError = "Every identifier needs both a kind and a value.";
            return Task.FromResult(false);
        }

        return Task.FromResult(true);
    }

    protected override async Task ApplyChangesAsync(BlogAdminDbContext dbContext)
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Title);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Title);
        var effectiveLinks = EffectiveLinks;
        var effectiveIdentifiers = EffectiveIdentifiers;

        var orderedSelectedTopicIds = _allTopics
            .OrderBy(topic => topic.Order)
            .ThenBy(topic => topic.Id)
            .Select(topic => topic.Id)
            .Where(topicId => _selectedTopicIds.Contains(topicId))
            .ToList();

        int resourceId;

        if (Id is int id)
        {
            var resource = await dbContext
                .Resources.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.Links)
                .Include(candidate => candidate.Identifiers)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyResourceFields(resource, _resource);
            ApplyTranslation(resource, "en", _translationEn, englishHasContent);
            ApplyTranslation(resource, "pt-BR", _translationPtBr, portugueseHasContent);

            dbContext.ResourceLinks.RemoveRange(resource.Links);
            foreach (var link in effectiveLinks)
            {
                resource.Links.Add(BuildLink(link));
            }

            dbContext.ResourceIdentifiers.RemoveRange(resource.Identifiers);
            foreach (var identifier in effectiveIdentifiers)
            {
                resource.Identifiers.Add(BuildIdentifier(identifier));
            }

            resourceId = resource.Id;
        }
        else
        {
            var resource = new Resource();
            ApplyResourceFields(resource, _resource);

            if (englishHasContent)
            {
                resource.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                resource.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            foreach (var link in effectiveLinks)
            {
                resource.Links.Add(BuildLink(link));
            }

            foreach (var identifier in effectiveIdentifiers)
            {
                resource.Identifiers.Add(BuildIdentifier(identifier));
            }

            resource.Order = await NextOrderAsync(dbContext.Resources, entity => entity.Order);
            resource.PublicId = PublicIds.New();
            dbContext.Resources.Add(resource);
            await dbContext.SaveChangesAsync();
            resourceId = resource.Id;
        }

        var existingTopicables = await dbContext
            .Topicables.Where(topicable =>
                topicable.TopicableType == "finding" && topicable.TopicableId == resourceId
            )
            .ToListAsync();
        dbContext.Topicables.RemoveRange(existingTopicables);

        foreach (var topicId in orderedSelectedTopicIds)
        {
            dbContext.Topicables.Add(
                new Topicable
                {
                    TopicId = topicId,
                    TopicableType = "finding",
                    TopicableId = resourceId,
                }
            );
        }
    }

    private static ResourceLink BuildLink(ResourceLinkFormModel source) =>
        new()
        {
            Url = source.Url,
            Label = source.Label,
            Platform = source.Platform,
            Purpose = source.Purpose,
            IsPrimary = source.IsPrimary,
            IsFree = source.IsFree,
            LanguageId = source.LanguageId,
        };

    private static ResourceIdentifier BuildIdentifier(ResourceIdentifierFormModel source) =>
        new() { Kind = source.Kind, Value = source.Value };

    private static void ApplyResourceFields(Resource target, Resource source)
    {
        target.Slug = source.Slug;
        target.Hidden = source.Hidden;
        target.Order = source.Order;
        target.Type = source.Type;
        target.LanguageId = source.LanguageId;
        target.Authors = source.Authors;
        target.Organizations = source.Organizations;
        target.PublishedDateIso = source.PublishedDateIso;
        target.FoundDateIso = source.FoundDateIso;
        target.ConsumptionState = source.ConsumptionState;
        target.Rating = source.Rating;
        target.EditorialState = source.EditorialState;
        target.Visibility = source.Visibility;
        target.TypeDetails = source.TypeDetails;
    }

    private static void ApplyTranslation(
        Resource resource,
        string locale,
        ResourceTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = resource.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            resource.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Title = source.Title;
        existing.AlternativeTitle = source.AlternativeTitle;
        existing.Description = source.Description;
        existing.PersonalNote = source.PersonalNote;
        existing.ReasonFound = source.ReasonFound;
        existing.Seo = source.Seo;
    }

    private static ResourceTranslation CloneTranslation(
        ResourceTranslation source,
        string locale
    ) =>
        new()
        {
            Locale = locale,
            Title = source.Title,
            AlternativeTitle = source.AlternativeTitle,
            Description = source.Description,
            PersonalNote = source.PersonalNote,
            ReasonFound = source.ReasonFound,
            Seo = source.Seo,
        };
}
