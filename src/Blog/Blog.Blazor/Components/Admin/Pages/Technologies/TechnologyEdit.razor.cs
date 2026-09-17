using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.Technologies;

public partial class TechnologyEdit
{
    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private Technology _technology = new();
    private TechnologyTranslation _translationEn = new() { Locale = "en" };
    private TechnologyTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private string _activeLocale = "en";

    private EditContext _technologyEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "technology";
    protected override string ListRoute => "/admin/technologies";

    protected override async Task LoadAsync(BlogAdminDbContext dbContext)
    {
        if (Id is int id)
        {
            var technology = await dbContext
                .Technologies.Include(candidate => candidate.Translations)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (technology is null)
            {
                ToastService.Error("Technology not found.");
                Navigation.NavigateTo("/admin/technologies");
                return;
            }

            _technology = technology;
            _translationEn =
                technology.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new TechnologyTranslation { TechnologyId = technology.Id, Locale = "en" };
            _translationPtBr =
                technology.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new TechnologyTranslation { TechnologyId = technology.Id, Locale = "pt-BR" };
        }

        _technologyEditContext = new EditContext(_technology);
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
            var technology = await dbContext
                .Technologies.Include(candidate => candidate.Translations)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyTechnologyFields(technology, _technology);
            ApplyTranslation(technology, "en", _translationEn, englishHasContent);
            ApplyTranslation(technology, "pt-BR", _translationPtBr, portugueseHasContent);
        }
        else
        {
            var technology = new Technology();
            ApplyTechnologyFields(technology, _technology);

            if (englishHasContent)
            {
                technology.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                technology.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            technology.Order = await NextOrderAsync(dbContext.Technologies, entity => entity.Order);
            technology.PublicId = PublicIds.New();
            dbContext.Technologies.Add(technology);
        }
    }

    private static void ApplyTechnologyFields(Technology target, Technology source)
    {
        target.Slug = source.Slug;
        target.Order = source.Order;
        target.Hidden = source.Hidden;
        target.Code = source.Code;
    }

    private static void ApplyTranslation(
        Technology technology,
        string locale,
        TechnologyTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = technology.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            technology.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Name = source.Name;
    }

    private static TechnologyTranslation CloneTranslation(
        TechnologyTranslation source,
        string locale
    ) => new() { Locale = locale, Name = source.Name };
}
