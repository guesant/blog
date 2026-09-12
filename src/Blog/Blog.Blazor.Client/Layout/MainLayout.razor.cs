using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Layout;

public partial class MainLayout
{
    private PublicSiteSnapshot? Snapshot { get; set; }
    private System.Globalization.CultureInfo CurrentCulture =>
        Cultures.Normalize(System.Globalization.CultureInfo.CurrentUICulture.Name);

    private string LocalizedPath(string path) =>
        Urls.ForCulture(
            path.Equals("home", StringComparison.OrdinalIgnoreCase) ? "/" : path,
            CurrentCulture.Name
        );

    protected override async Task OnInitializedAsync() =>
        Snapshot = await ContentProvider.GetAsync(
            CultureCatalog.NormalizeName(CultureInfo.CurrentUICulture.Name)
        );
}
