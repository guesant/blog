namespace Portfolio.Blazor.Client.Shared;

public partial class SiteFilterCard
{
    [Parameter, EditorRequired]
    public string Action { get; set; } = string.Empty;

    [Parameter]
    public string Method { get; set; } = "get";

    [Parameter]
    public string FormClass { get; set; } = string.Empty;

    [Parameter]
    public string DataLayoutRegion { get; set; } = "filters";

    [Parameter]
    public string Class { get; set; } = string.Empty;

    [Parameter]
    public EventCallback OnApply { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private string ToolbarClass =>
        string.Join(
            ' ',
            new[] { "site-filter-toolbar", Class }.Where(value => !string.IsNullOrWhiteSpace(value))
        );

    private Task HandleSubmit() => OnApply.InvokeAsync();
}
