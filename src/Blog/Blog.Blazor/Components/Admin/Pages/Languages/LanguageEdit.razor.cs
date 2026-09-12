using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.Languages;

public partial class LanguageEdit
{
    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private Language _language = new();
    private LanguageTranslation _translationEn = new() { Locale = "en" };
    private LanguageTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private string _activeLocale = "en";

    private EditContext _languageEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "language";
    protected override string ListRoute => "/admin/languages";

    protected override async Task LoadAsync(BlogAdminDbContext dbContext)
    {
        if (Id is int id)
        {
            var language = await dbContext
                .Languages.Include(candidate => candidate.Translations)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (language is null)
            {
                ToastService.Error("Language not found.");
                Navigation.NavigateTo("/admin/languages");
                return;
            }

            _language = language;
            _translationEn =
                language.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new LanguageTranslation { LanguageId = language.Id, Locale = "en" };
            _translationPtBr =
                language.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new LanguageTranslation { LanguageId = language.Id, Locale = "pt-BR" };
        }

        _languageEditContext = new EditContext(_language);
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
            var language = await dbContext
                .Languages.Include(candidate => candidate.Translations)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyLanguageFields(language, _language);
            ApplyTranslation(language, "en", _translationEn, englishHasContent);
            ApplyTranslation(language, "pt-BR", _translationPtBr, portugueseHasContent);
        }
        else
        {
            var language = new Language();
            ApplyLanguageFields(language, _language);

            if (englishHasContent)
            {
                language.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                language.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            language.Order = await NextOrderAsync(dbContext.Languages, entity => entity.Order);
            dbContext.Languages.Add(language);
        }
    }

    private static void ApplyLanguageFields(Language target, Language source)
    {
        target.Slug = source.Slug;
        target.Code = source.Code;
        target.Order = source.Order;
    }

    private static void ApplyTranslation(
        Language language,
        string locale,
        LanguageTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = language.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            language.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Name = source.Name;
    }

    private static LanguageTranslation CloneTranslation(
        LanguageTranslation source,
        string locale
    ) => new() { Locale = locale, Name = source.Name };
}
