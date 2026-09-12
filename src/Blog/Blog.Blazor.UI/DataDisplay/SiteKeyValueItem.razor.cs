namespace Blog.Blazor.UI.DataDisplay;

public partial class SiteKeyValueItem
{
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary>Icon rendered before the term.</summary>
    [Parameter]
    public string? Icon { get; set; }

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    /// <summary>Class applied to the dt element, replacing its default typography.</summary>
    [Parameter]
    public string LabelClass { get; set; } = "text-body-secondary";

    /// <summary>Class applied to the dd element, replacing its default layout.</summary>
    [Parameter]
    public string ValueClass { get; set; } = "site-key-value-value";

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private string RootClass => SiteCss.Join("site-key-value-item", Class);
}
