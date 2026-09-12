namespace Blog.Blazor.UI.Navigation;

public partial class SiteNavItemLabel
{
    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private string RootClass => SiteCss.Join("nav-item-label", Class);
}
