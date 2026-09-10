using System.Globalization;
using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Collections;

public partial class CollectionEdit
{
    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private ReferenceCollection _collection = new();
    private ReferenceCollectionTranslation _translationEn = new() { Locale = "en" };
    private ReferenceCollectionTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private List<Resource> _allResources = [];
    private List<int> _selectedResourceIds = [];
    private Dictionary<int, string> _itemNotes = [];
    private string _resourceSearch = string.Empty;
    private string _activeLocale = "en";

    private EditContext _collectionEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "collection";
    protected override string ListRoute => "/admin/collections";

    private List<Resource> FilteredResources =>
        _allResources
            .Where(resource =>
                string.IsNullOrWhiteSpace(_resourceSearch)
                || DisplayResourceLabel(resource)
                    .Contains(_resourceSearch, StringComparison.OrdinalIgnoreCase)
            )
            .ToList();

    protected override async Task LoadAsync(PortfolioAdminDbContext dbContext)
    {
        _allResources = await dbContext
            .Resources.Include(resource => resource.Translations)
            .AsNoTracking()
            .OrderBy(resource => resource.Order)
            .ThenBy(resource => resource.Slug)
            .ToListAsync();

        if (Id is int id)
        {
            var collection = await dbContext
                .ReferenceCollections.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.Items)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (collection is null)
            {
                ToastService.Error("Collection not found.");
                Navigation.NavigateTo("/admin/collections");
                return;
            }

            _collection = collection;
            _translationEn =
                collection.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new ReferenceCollectionTranslation
                {
                    ReferenceCollectionId = collection.Id,
                    Locale = "en",
                };
            _translationPtBr =
                collection.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new ReferenceCollectionTranslation
                {
                    ReferenceCollectionId = collection.Id,
                    Locale = "pt-BR",
                };

            _selectedResourceIds = collection
                .Items.OrderBy(item => item.Order ?? int.MaxValue)
                .ThenBy(item => item.ResourceId)
                .Select(item => item.ResourceId)
                .ToList();
            _itemNotes = collection.Items.ToDictionary(
                item => item.ResourceId,
                item => item.Note ?? string.Empty
            );
        }

        _collectionEditContext = new EditContext(_collection);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
    }

    private static string DisplayResourceLabel(Resource resource)
    {
        var title =
            TranslationLookup.Resolve(
                resource.Translations,
                translation => translation.Locale,
                translation => translation.Title,
                "en"
            ) ?? resource.Slug;
        return $"{title} ({resource.Type})";
    }

    private string GetNote(int resourceId) =>
        _itemNotes.GetValueOrDefault(resourceId, string.Empty);

    private void SetNote(int resourceId, string value) => _itemNotes[resourceId] = value;

    private Task HandleResourceSearchChanged(string value)
    {
        _resourceSearch = value;
        return Task.CompletedTask;
    }

    private Task HandleToggleResource(int resourceId, bool isSelected)
    {
        if (isSelected)
        {
            if (!_selectedResourceIds.Contains(resourceId))
            {
                _selectedResourceIds.Add(resourceId);
            }
        }
        else
        {
            _selectedResourceIds.Remove(resourceId);
            _itemNotes.Remove(resourceId);
        }

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

        if (Id is int id)
        {
            var collection = await dbContext
                .ReferenceCollections.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.Items)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyCollectionFields(collection, _collection);
            ApplyTranslation(collection, "en", _translationEn, englishHasContent);
            ApplyTranslation(collection, "pt-BR", _translationPtBr, portugueseHasContent);

            dbContext.ReferenceCollectionItems.RemoveRange(collection.Items);
            for (var index = 0; index < _selectedResourceIds.Count; index++)
            {
                var resourceId = _selectedResourceIds[index];
                dbContext.ReferenceCollectionItems.Add(
                    new ReferenceCollectionItem
                    {
                        ReferenceCollectionId = collection.Id,
                        ResourceId = resourceId,
                        Note = NullIfBlank(_itemNotes.GetValueOrDefault(resourceId, string.Empty)),
                        Order = index,
                    }
                );
            }
        }
        else
        {
            var collection = new ReferenceCollection();
            ApplyCollectionFields(collection, _collection);

            if (englishHasContent)
            {
                collection.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                collection.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            for (var index = 0; index < _selectedResourceIds.Count; index++)
            {
                var resourceId = _selectedResourceIds[index];
                collection.Items.Add(
                    new ReferenceCollectionItem
                    {
                        ResourceId = resourceId,
                        Note = NullIfBlank(_itemNotes.GetValueOrDefault(resourceId, string.Empty)),
                        Order = index,
                    }
                );
            }

            collection.Order = await NextOrderAsync(
                dbContext.ReferenceCollections,
                entity => entity.Order
            );
            collection.PublicId = PublicIds.New();
            dbContext.ReferenceCollections.Add(collection);
        }
    }

    private static void ApplyCollectionFields(
        ReferenceCollection target,
        ReferenceCollection source
    )
    {
        target.Slug = source.Slug;
        target.Hidden = source.Hidden;
        target.Order = source.Order;
        target.PublishedAt = source.PublishedAt;
    }

    private static void ApplyTranslation(
        ReferenceCollection collection,
        string locale,
        ReferenceCollectionTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = collection.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            collection.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Title = source.Title;
        existing.Description = source.Description;
        existing.Intro = source.Intro;
        existing.Seo = source.Seo;
    }

    private static ReferenceCollectionTranslation CloneTranslation(
        ReferenceCollectionTranslation source,
        string locale
    ) =>
        new()
        {
            Locale = locale,
            Title = source.Title,
            Description = source.Description,
            Intro = source.Intro,
            Seo = source.Seo,
        };
}
