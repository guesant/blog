using Microsoft.Extensions.Localization;
using Portfolio.Blazor.Core.Localization;

namespace Portfolio.Blazor.UI.Layout;

public partial class SiteHero
{
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    [Parameter]
    public RenderFragment? TitleContent { get; set; }

    [Parameter]
    public string? Lead { get; set; }

    [Parameter]
    public string? Meta { get; set; }

    [Parameter]
    public string? BackHref { get; set; }

    [Parameter]
    public string BackLabel { get; set; } = "previous page";

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
    private string BackAriaLabel => L["back_to", BackLabel];
}
