using Blog.Blazor.Core;
using Blog.Blazor.Core.Localization;
using Microsoft.Extensions.Localization;

namespace Blog.Blazor.UI.Navigation;

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
