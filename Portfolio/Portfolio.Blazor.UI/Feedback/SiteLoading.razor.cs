namespace Portfolio.Blazor.UI.Feedback;

public partial class SiteLoading
{
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;
}
