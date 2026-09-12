using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.NavItems;

public partial class NavItemList
{
    protected override string EntityLabel => "nav item";

    protected override void SetOrder(NavItem entity, int order) => entity.Order = order;

    protected override async Task<List<NavItem>> LoadEntitiesAsync(BlogAdminDbContext dbContext) =>
        await dbContext
            .NavItems.Include(navItem => navItem.Translations)
            .AsNoTracking()
            .OrderBy(navItem => navItem.SidebarGroup)
            .ThenBy(navItem => navItem.Order)
            .ToListAsync();

    protected override Task<NavItem?> FindTrackedAsync(BlogAdminDbContext dbContext, int id) =>
        dbContext.NavItems.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(NavItem navItem) =>
        TranslationLookup.Resolve(
            navItem.Translations,
            translation => translation.Locale,
            translation => translation.Label,
            "en"
        ) ?? navItem.RouteName;

    protected override int GetId(NavItem navItem) => navItem.Id;

    protected override string DeleteConfirmDescription(NavItem entity)
    {
        var hasChildren = Items.Any(candidate => candidate.ParentId == entity.Id);
        return hasChildren
            ? "This permanently removes the nav item and its translations. This cannot be undone. Its child nav items will not be deleted — they will lose their parent and become top-level items."
            : "This permanently removes the nav item and its translations. This cannot be undone.";
    }

    private string ParentLabel(NavItem navItem)
    {
        if (navItem.ParentId is not int parentId)
        {
            return "—";
        }

        var parent = Items.FirstOrDefault(candidate => candidate.Id == parentId);
        return parent is null ? "—" : DisplayTitle(parent);
    }
}
