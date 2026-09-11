namespace Portfolio.Blazor.UI.Templates;

public partial class SiteAuthCard
{
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    [Parameter]
    public string? Error { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>Destination of the trailing "back" link; empty hides it.</summary>
    [Parameter]
    public string? BackHref { get; set; }

    [Parameter]
    public string? BackLabel { get; set; }
}
