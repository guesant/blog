using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Credits;

public partial class CreditEdit
{
    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private CreditEntry _credit = new();
    private CreditEntryTranslation _translationEn = new() { Locale = "en" };
    private CreditEntryTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private string _activeLocale = "en";

    private EditContext _creditEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "credit";
    protected override string ListRoute => "/admin/credits";

    protected override async Task LoadAsync(PortfolioAdminDbContext dbContext)
    {
        if (Id is int id)
        {
            var credit = await dbContext
                .CreditEntries.Include(candidate => candidate.Translations)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (credit is null)
            {
                ToastService.Error("Credit not found.");
                Navigation.NavigateTo("/admin/credits");
                return;
            }

            _credit = credit;
            _translationEn =
                credit.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new CreditEntryTranslation { CreditEntryId = credit.Id, Locale = "en" };
            _translationPtBr =
                credit.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new CreditEntryTranslation { CreditEntryId = credit.Id, Locale = "pt-BR" };
        }
        else
        {
            _credit.Active = true;
        }

        _creditEditContext = new EditContext(_credit);
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

    protected override async Task ApplyChangesAsync(PortfolioAdminDbContext dbContext)
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Name);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Name);

        if (Id is int id)
        {
            var credit = await dbContext
                .CreditEntries.Include(candidate => candidate.Translations)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyCreditFields(credit, _credit);
            ApplyTranslation(credit, "en", _translationEn, englishHasContent);
            ApplyTranslation(credit, "pt-BR", _translationPtBr, portugueseHasContent);
        }
        else
        {
            var credit = new CreditEntry();
            ApplyCreditFields(credit, _credit);

            if (englishHasContent)
            {
                credit.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                credit.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            credit.Order = await NextOrderAsync(dbContext.CreditEntries, entity => entity.Order);
            dbContext.CreditEntries.Add(credit);
        }
    }

    private static void ApplyCreditFields(CreditEntry target, CreditEntry source)
    {
        target.Category = source.Category;
        target.Order = source.Order;
        target.Url = source.Url;
        target.Active = source.Active;
    }

    private static void ApplyTranslation(
        CreditEntry credit,
        string locale,
        CreditEntryTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = credit.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            credit.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Name = source.Name;
        existing.Description = source.Description;
    }

    private static CreditEntryTranslation CloneTranslation(
        CreditEntryTranslation source,
        string locale
    ) =>
        new()
        {
            Locale = locale,
            Name = source.Name,
            Description = source.Description,
        };
}
