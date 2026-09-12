namespace Blog.Blazor.UI.DataDisplay;

public partial class SiteLinkList
{
    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>One or more SiteLinkItem children.</summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private string RootClass => SiteCss.Join("site-link-list", Class);
}
