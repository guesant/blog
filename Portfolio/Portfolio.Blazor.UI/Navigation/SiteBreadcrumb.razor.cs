using Microsoft.Extensions.Localization;
using Portfolio.Blazor.Core;
using Portfolio.Blazor.Core.Localization;

namespace Portfolio.Blazor.UI.Navigation;

public partial class SiteBreadcrumb
{
    [Parameter]
    public string HomeUrl { get; set; } = "/";

    [Parameter]
    public string HomeLabel { get; set; } = "home";

    [Parameter]
    public IReadOnlyList<BreadcrumbLink> Links { get; set; } = [];

    [Parameter, EditorRequired]
    public string CurrentLabel { get; set; } = string.Empty;

    [Parameter]
    public bool ShowHomeLink { get; set; } = true;
    private string ResolvedHomeUrl => HomeUrl;
}
