namespace Blog.Blazor.UI.DataDisplay;

public partial class SiteStatItem
{
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
