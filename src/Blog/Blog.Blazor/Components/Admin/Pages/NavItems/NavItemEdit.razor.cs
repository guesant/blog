using System.Globalization;
using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.NavItems;

public partial class NavItemEdit
{
    [Parameter]
    public int? Id { get; set; }

    private static readonly IReadOnlyList<SiteSelectOption> PlacementOptions =
    [
        new SiteSelectOption("sidebar", "Sidebar"),
        new SiteSelectOption("footer_links", "Footer links"),
    ];

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private NavItem _navItem = new();
    private NavItemTranslation _translationEn = new() { Locale = "en" };
    private NavItemTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private List<NavItem> _allNavItems = [];
    private string _activeLocale = "en";

    private EditContext _navItemEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "nav item";
    protected override string ListRoute => "/admin/nav-items";

    private string PlacementValue
    {
        get => _navItem.Placement ?? string.Empty;
        set => _navItem.Placement = NullIfBlank(value);
    }

    private string ParentIdValue
    {
        get => _navItem.ParentId?.ToString(CultureInfo.InvariantCulture) ?? string.Empty;
        set =>
            _navItem.ParentId = string.IsNullOrWhiteSpace(value)
                ? null
                : int.Parse(value, CultureInfo.InvariantCulture);
    }

    private IReadOnlyList<SiteSelectOption> ParentOptions =>
        _allNavItems
            .Where(candidate => candidate.Id != Id)
            .Select(candidate => new SiteSelectOption(
                candidate.Id.ToString(CultureInfo.InvariantCulture),
                DisplayLabel(candidate)
            ))
            .ToArray();

    protected override async Task LoadAsync(BlogAdminDbContext dbContext)
    {
        _allNavItems = await dbContext
            .NavItems.Include(candidate => candidate.Translations)
            .AsNoTracking()
            .OrderBy(candidate => candidate.SidebarGroup)
            .ThenBy(candidate => candidate.Order)
            .ToListAsync();

        if (Id is int id)
        {
            var navItem = await dbContext
                .NavItems.Include(candidate => candidate.Translations)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (navItem is null)
            {
                ToastService.Error("Nav item not found.");
                Navigation.NavigateTo("/admin/nav-items");
                return;
            }

            _navItem = navItem;
            _translationEn =
                navItem.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new NavItemTranslation { NavItemId = navItem.Id, Locale = "en" };
            _translationPtBr =
                navItem.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new NavItemTranslation { NavItemId = navItem.Id, Locale = "pt-BR" };
        }

        _navItemEditContext = new EditContext(_navItem);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
    }

    private static string DisplayLabel(NavItem navItem) =>
        TranslationLookup.Resolve(
            navItem.Translations,
            translation => translation.Locale,
            translation => translation.Label,
            "en"
        ) ?? navItem.RouteName;

    protected override Task<bool> ValidateAsync()
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Label);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Label);
        var englishValid = !englishHasContent || _enEditContext.Validate();
        var portugueseValid = !portugueseHasContent || _ptEditContext.Validate();

        if (!englishValid || !portugueseValid)
        {
            return Task.FromResult(false);
        }

        if (!englishHasContent && !portugueseHasContent)
        {
            SaveError = "Provide a label in at least one language.";
            return Task.FromResult(false);
        }

        if (IsEditing && _navItem.ParentId == Id)
        {
            SaveError = "A nav item cannot be its own parent.";
            return Task.FromResult(false);
        }

        return Task.FromResult(true);
    }

    protected override async Task ApplyChangesAsync(BlogAdminDbContext dbContext)
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Label);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Label);

        if (Id is int id)
        {
            var navItem = await dbContext
                .NavItems.Include(candidate => candidate.Translations)
                .FirstAsync(candidate => candidate.Id == id);

            ApplyNavItemFields(navItem, _navItem);
            ApplyTranslation(navItem, "en", _translationEn, englishHasContent);
            ApplyTranslation(navItem, "pt-BR", _translationPtBr, portugueseHasContent);
        }
        else
        {
            var navItem = new NavItem();
            ApplyNavItemFields(navItem, _navItem);

            if (englishHasContent)
            {
                navItem.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                navItem.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            navItem.Order = await NextOrderAsync(dbContext.NavItems, entity => entity.Order);
            dbContext.NavItems.Add(navItem);
        }
    }

    private static void ApplyNavItemFields(NavItem target, NavItem source)
    {
        target.RouteName = source.RouteName;
        target.ParentId = source.ParentId;
        target.Placement = source.Placement;
        target.SidebarGroup = source.SidebarGroup;
        target.Order = source.Order;
    }

    private static void ApplyTranslation(
        NavItem navItem,
        string locale,
        NavItemTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = navItem.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            navItem.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Label = source.Label;
    }

    private static NavItemTranslation CloneTranslation(NavItemTranslation source, string locale) =>
        new() { Locale = locale, Label = source.Label };
}
