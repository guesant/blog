namespace Portfolio.Blazor.Client.Shared;

public partial class AvailabilityIndicator
{
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;
}
