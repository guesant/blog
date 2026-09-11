namespace Portfolio.Blazor.Client.Shared;

public partial class SiteErrorMessage
{
    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public string Role { get; set; } = "alert";

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object> AdditionalAttributes { get; set; } = new();

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
