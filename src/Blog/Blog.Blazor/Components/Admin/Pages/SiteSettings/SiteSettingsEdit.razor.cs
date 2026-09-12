using Microsoft.AspNetCore.Authorization;
using SiteSettingsEntity = Blog.Blazor.Data.Entities.SiteSettings;
using SiteSettingsTranslationEntity = Blog.Blazor.Data.Entities.SiteSettingsTranslation;

namespace Blog.Blazor.Components.Admin.Pages.SiteSettings;

public partial class SiteSettingsEdit
{
    private static readonly string[] ContactPlatforms =
    [
        "linkedin",
        "github",
        "gitlab",
        "lattes",
        "orcid",
        "mail",
    ];

    private sealed class ContactProfileFormModel
    {
        public string Platform { get; set; } = string.Empty;
        public string? Label { get; set; }
        public string Url { get; set; } = string.Empty;
    }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private SiteSettingsEntity _settings = new();
    private SiteSettingsTranslationEntity _translationEn = new() { Locale = "en" };
    private SiteSettingsTranslationEntity _translationPtBr = new() { Locale = "pt-BR" };
    private List<ContactProfileFormModel> _contacts = [];
    private string _activeLocale = "en";

    private EditContext _settingsEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    protected override string EntityLabel => "site settings";
    protected override string ListRoute => "/admin/site-settings";

    protected override async Task LoadAsync(BlogAdminDbContext dbContext)
    {
        var settings = await dbContext
            .SiteSettings.Include(candidate => candidate.Translations)
            .Include(candidate => candidate.ContactProfiles)
            .AsNoTracking()
            .OrderBy(candidate => candidate.Id)
            .FirstOrDefaultAsync();

        if (settings is null)
        {
            ToastService.Error("Site settings not found.");
            Navigation.NavigateTo("/admin");
            return;
        }

        _settings = settings;
        _translationEn =
            settings.Translations.FirstOrDefault(translation => translation.Locale == "en")
            ?? new SiteSettingsTranslationEntity { SiteSettingsId = settings.Id, Locale = "en" };
        _translationPtBr =
            settings.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
            ?? new SiteSettingsTranslationEntity { SiteSettingsId = settings.Id, Locale = "pt-BR" };

        _contacts = settings
            .ContactProfiles.OrderBy(contact => contact.Order)
            .ThenBy(contact => contact.Id)
            .Select(contact => new ContactProfileFormModel
            {
                Platform = contact.Platform,
                Label = contact.Label,
                Url = contact.Url,
            })
            .ToList();

        _settingsEditContext = new EditContext(_settings);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
    }

    private void HandleAddContact() => _contacts.Add(new ContactProfileFormModel());

    private void HandleRemoveContact(int index) => _contacts.RemoveAt(index);

    private static bool ContactHasContent(ContactProfileFormModel contact) =>
        !string.IsNullOrWhiteSpace(contact.Platform)
        || !string.IsNullOrWhiteSpace(contact.Label)
        || !string.IsNullOrWhiteSpace(contact.Url);

    protected override Task<bool> ValidateAsync()
    {
        if (!_enEditContext.Validate() || !_ptEditContext.Validate())
        {
            return Task.FromResult(false);
        }

        var effectiveContacts = _contacts.Where(ContactHasContent).ToList();
        if (
            effectiveContacts.Any(contact =>
                string.IsNullOrWhiteSpace(contact.Platform)
                || string.IsNullOrWhiteSpace(contact.Url)
            )
        )
        {
            SaveError = "Every contact needs a platform and a URL.";
            return Task.FromResult(false);
        }

        return Task.FromResult(true);
    }

    protected override async Task ApplyChangesAsync(BlogAdminDbContext dbContext)
    {
        var effectiveContacts = _contacts.Where(ContactHasContent).ToList();

        var settings = await dbContext
            .SiteSettings.Include(candidate => candidate.Translations)
            .Include(candidate => candidate.ContactProfiles)
            .FirstAsync(candidate => candidate.Id == _settings.Id);

        settings.ShortName = _settings.ShortName;
        settings.PortfolioUrl = _settings.PortfolioUrl;
        settings.SourceRepositoryUrl = _settings.SourceRepositoryUrl;
        settings.ContactEmail = _settings.ContactEmail;
        settings.MaintenanceEnabled = _settings.MaintenanceEnabled;
        settings.ContactAvailable = _settings.ContactAvailable;

        ApplyTranslation(settings, "en", _translationEn);
        ApplyTranslation(settings, "pt-BR", _translationPtBr);

        dbContext.ContactProfiles.RemoveRange(settings.ContactProfiles);
        for (var index = 0; index < effectiveContacts.Count; index++)
        {
            settings.ContactProfiles.Add(
                new ContactProfile
                {
                    SiteSettingsId = settings.Id,
                    Platform = effectiveContacts[index].Platform,
                    Label = effectiveContacts[index].Label,
                    Url = effectiveContacts[index].Url,
                    Order = index,
                }
            );
        }
    }

    private static void ApplyTranslation(
        SiteSettingsEntity settings,
        string locale,
        SiteSettingsTranslationEntity source
    )
    {
        var existing = settings.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            settings.Translations.Add(
                new SiteSettingsTranslationEntity
                {
                    Locale = locale,
                    CopyrightTemplate = source.CopyrightTemplate,
                    MaintenanceEyebrow = source.MaintenanceEyebrow,
                    MaintenanceTitle = source.MaintenanceTitle,
                    MaintenanceDescription = source.MaintenanceDescription,
                    Seo = source.Seo,
                }
            );
            return;
        }

        existing.CopyrightTemplate = source.CopyrightTemplate;
        existing.MaintenanceEyebrow = source.MaintenanceEyebrow;
        existing.MaintenanceTitle = source.MaintenanceTitle;
        existing.MaintenanceDescription = source.MaintenanceDescription;
        existing.Seo = source.Seo;
    }
}
