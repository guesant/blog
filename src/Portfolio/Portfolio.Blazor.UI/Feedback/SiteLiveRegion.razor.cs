namespace Portfolio.Blazor.UI.Feedback;

public partial class SiteLiveRegion
{
    [Parameter]
    public SiteLivePoliteness Politeness { get; set; } = SiteLivePoliteness.Polite;

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
