namespace Blog.Blazor.Client.Shared;

public partial class SiteListingFilterBar
{
    [Parameter, EditorRequired]
    public string Action { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public RenderFragment PrimaryFields { get; set; } = default!;

    [Parameter]
    public RenderFragment? SearchField { get; set; }

    [Parameter]
    public RenderFragment? AdvancedFields { get; set; }

    [Parameter]
    public string AdvancedSummary { get; set; } = string.Empty;

    [Parameter]
    public bool AdvancedOpen { get; set; }

    [Parameter, EditorRequired]
    public string ApplyLabel { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string ClearLabel { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string ClearHref { get; set; } = string.Empty;

    [Parameter]
    public EventCallback OnApply { get; set; }
}
