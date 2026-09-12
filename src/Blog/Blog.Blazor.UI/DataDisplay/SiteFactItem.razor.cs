namespace Blog.Blazor.UI.DataDisplay;

public partial class SiteFactItem
{
    /// <summary>Short term shown above the value, e.g. "ISBN".</summary>
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary>Icon rendered before the term.</summary>
    [Parameter]
    public string? Icon { get; set; }

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private string RootClass => SiteCss.Join("site-fact-item", Class);
}
