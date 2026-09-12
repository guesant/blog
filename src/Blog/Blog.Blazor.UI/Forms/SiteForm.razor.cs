namespace Blog.Blazor.UI.Forms;

public partial class SiteForm
{
    /// <summary>Bound model for a non-EditContext EditForm.</summary>
    [Parameter]
    public object? Model { get; set; }

    /// <summary>Explicit EditContext; takes precedence over Model.</summary>
    [Parameter]
    public EditContext? EditContext { get; set; }

    /// <summary>Action URL for the plain (non-EditForm) static submission.</summary>
    [Parameter]
    public string Action { get; set; } = string.Empty;

    /// <summary>HTTP method for the plain static submission.</summary>
    [Parameter]
    public string Method { get; set; } = "get";

    /// <summary>Whether the plain static form participates in enhanced navigation.</summary>
    [Parameter]
    public bool Enhance { get; set; } = true;

    /// <summary>data-layout-region value on the rendered form element.</summary>
    [Parameter]
    public string? Region { get; set; }

    /// <summary>Forces the static or interactive branch of the plain form, bypassing RendererInfo.IsInteractive. Has no effect when Model or EditContext is set.</summary>
    [Parameter]
    public SiteFormMode Mode { get; set; } = SiteFormMode.Auto;

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    /// <summary>Submit handler for the plain interactive form.</summary>
    [Parameter]
    public EventCallback OnSubmit { get; set; }

    /// <summary>Valid-submit handler for the EditForm branch.</summary>
    [Parameter]
    public EventCallback<EditContext> OnValidSubmit { get; set; }

    /// <summary>Invalid-submit handler for the EditForm branch.</summary>
    [Parameter]
    public EventCallback<EditContext> OnInvalidSubmit { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private bool ResolvedInteractive =>
        Mode switch
        {
            SiteFormMode.Static => false,
            SiteFormMode.Interactive => true,
            _ => RendererInfo.IsInteractive,
        };

    private IReadOnlyDictionary<string, object> ForwardedAttributes =>
        AdditionalAttributes ?? new Dictionary<string, object>();

    private Task HandleSubmit() => OnSubmit.InvokeAsync();
}
