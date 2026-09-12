namespace Blog.Blazor.UI.Feedback;

public partial class SiteInlineError
{
    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
