namespace Blog.Blazor.UI.DataDisplay;

public partial class SiteMetricCard
{
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private readonly string _instanceId = Guid.NewGuid().ToString("n")[..8];
    private string LabelId => $"metric-card-label-{_instanceId}";
}
