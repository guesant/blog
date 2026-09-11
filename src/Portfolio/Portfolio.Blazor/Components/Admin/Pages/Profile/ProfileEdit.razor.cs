using Microsoft.AspNetCore.Authorization;
using ProfileEntity = Portfolio.Blazor.Data.Entities.Profile;
using ProfileTranslationEntity = Portfolio.Blazor.Data.Entities.ProfileTranslation;

namespace Portfolio.Blazor.Components.Admin.Pages.Profile;

public partial class ProfileEdit
{
    private static readonly string[] TrajectoryFields =
    [
        "role",
        "organization",
        "period",
        "highlights:list",
        "includeInResume:bool",
        "hidden:bool",
    ];
    private static readonly string[] MilestoneFields =
    [
        "year",
        "title",
        "description",
        "hidden:bool",
    ];
    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private ProfileEntity _profile = new();
    private ProfileTranslationEntity _translationEn = new() { Locale = "en" };
    private ProfileTranslationEntity _translationPtBr = new() { Locale = "pt-BR" };
    private string _activeLocale = "en";

    private EditContext _profileEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    protected override string EntityLabel => "profile";
    protected override string ListRoute => "/admin/profile";

    protected override async Task LoadAsync(PortfolioAdminDbContext dbContext)
    {
        var profile = await dbContext
            .Profiles.Include(candidate => candidate.Translations)
            .AsNoTracking()
            .OrderBy(candidate => candidate.Id)
            .FirstOrDefaultAsync();

        if (profile is null)
        {
            ToastService.Error("Profile not found.");
            Navigation.NavigateTo("/admin");
            return;
        }

        _profile = profile;
        _translationEn =
            profile.Translations.FirstOrDefault(translation => translation.Locale == "en")
            ?? new ProfileTranslationEntity { ProfileId = profile.Id, Locale = "en" };
        _translationPtBr =
            profile.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
            ?? new ProfileTranslationEntity { ProfileId = profile.Id, Locale = "pt-BR" };

        _profileEditContext = new EditContext(_profile);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
    }

    protected override Task<bool> ValidateAsync()
    {
        var isValid = _enEditContext.Validate() && _ptEditContext.Validate();
        return Task.FromResult(isValid);
    }

    protected override async Task ApplyChangesAsync(PortfolioAdminDbContext dbContext)
    {
        var profile = await dbContext
            .Profiles.Include(candidate => candidate.Translations)
            .FirstAsync(candidate => candidate.Id == _profile.Id);

        profile.Name = _profile.Name;
        profile.BirthDate = _profile.BirthDate;

        ApplyTranslation(profile, "en", _translationEn);
        ApplyTranslation(profile, "pt-BR", _translationPtBr);
    }

    private static void ApplyTranslation(
        ProfileEntity profile,
        string locale,
        ProfileTranslationEntity source
    )
    {
        var existing = profile.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            profile.Translations.Add(
                new ProfileTranslationEntity
                {
                    Locale = locale,
                    Title = source.Title,
                    Location = source.Location,
                    BirthCity = source.BirthCity,
                    Description = source.Description,
                    Interests = source.Interests,
                    Learning = source.Learning,
                    PersonalInterests = source.PersonalInterests,
                    Trajectory = source.Trajectory,
                    Milestones = source.Milestones,
                    Fortunes = source.Fortunes,
                    PersonalFacts = source.PersonalFacts,
                    PersonalThings = source.PersonalThings,
                }
            );
            return;
        }

        existing.Title = source.Title;
        existing.Location = source.Location;
        existing.BirthCity = source.BirthCity;
        existing.Description = source.Description;
        existing.Interests = source.Interests;
        existing.Learning = source.Learning;
        existing.PersonalInterests = source.PersonalInterests;
        existing.Trajectory = source.Trajectory;
        existing.Milestones = source.Milestones;
        existing.Fortunes = source.Fortunes;
        existing.PersonalFacts = source.PersonalFacts;
        existing.PersonalThings = source.PersonalThings;
    }
}
