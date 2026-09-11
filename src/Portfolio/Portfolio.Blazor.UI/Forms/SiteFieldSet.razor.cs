namespace Portfolio.Blazor.UI.Forms;

public partial class SiteFieldSet
{
    [Parameter, EditorRequired]
    public string Legend { get; set; } = string.Empty;

    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private string RootClass => SiteCss.Join("site-fieldset", Class);
    private IReadOnlyDictionary<string, object> ForwardedAttributes =>
        AdditionalAttributes ?? new Dictionary<string, object>();
}
