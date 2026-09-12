namespace Blog.Blazor.UI.Feedback;

public partial class SiteEmptyState
{
    [Parameter, EditorRequired]
    public string Message { get; set; } = string.Empty;

    [Parameter]
    public string? Region { get; set; }

    [Parameter]
    public bool Cat { get; set; } = true;

    [Parameter]
    public string Eyes { get; set; } = "^.^";

    private IReadOnlyDictionary<string, object> RegionAttributes =>
        string.IsNullOrWhiteSpace(Region)
            ? new Dictionary<string, object>()
            : new Dictionary<string, object> { ["data-layout-region"] = Region! };
}
