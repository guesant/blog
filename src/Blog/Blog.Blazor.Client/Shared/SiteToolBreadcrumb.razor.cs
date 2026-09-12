using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Shared;

public partial class SiteToolBreadcrumb
{
    private CultureInfo CurrentCulture => Cultures.Normalize(CultureInfo.CurrentUICulture.Name);
    private string CurrentPath =>
        CultureCatalog.RemoveCulturePrefix(new Uri(Navigation.Uri).AbsolutePath).TrimEnd('/');
    private string ToolSlug =>
        CurrentPath.Split('/', StringSplitOptions.RemoveEmptyEntries).LastOrDefault() ?? "tools";

    private string ToolBreadcrumbCurrentLabel
    {
        get
        {
            if (ToolSlug.Equals("tools", StringComparison.OrdinalIgnoreCase))
            {
                return NavL["tools"];
            }

            var definition = ToolCatalog.All.FirstOrDefault(tool =>
                tool.Slug.Equals(ToolSlug, StringComparison.OrdinalIgnoreCase)
            );
            return !string.IsNullOrWhiteSpace(definition.Slug)
                ? ToolCatalog.LocalizedTitle(definition, CurrentCulture)
                : ToolSlug.Replace('-', ' ');
        }
    }

    private IReadOnlyList<BreadcrumbLink> ToolBreadcrumbLinks =>
        ToolSlug.Equals("tools", StringComparison.OrdinalIgnoreCase)
            ? []
            : [new(NavL["tools"], LocalizedPath("/tools"))];

    private string LocalizedPath(string path) => Urls.ForCulture(path, CurrentCulture.Name);
}
