namespace Portfolio.Blazor.UI.Forms;

public partial class SiteFormActions
{
    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    /// <summary>Gives every action an equal share of the row at all widths (the default only does so on narrow screens).</summary>
    [Parameter]
    public bool Fill { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
