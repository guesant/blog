namespace Portfolio.Blazor.UI.Forms;

public partial class SiteToolForm
{
    /// <summary>Action URL used by the static (SSR, GET) branch.</summary>
    [Parameter, EditorRequired]
    public string Action { get; set; } = string.Empty;

    /// <summary>HTTP method for the static branch.</summary>
    [Parameter]
    public string Method { get; set; } = "get";

    /// <summary>Accessible name for the form card when there is no visible heading.</summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>data-layout-region on the static form element.</summary>
    [Parameter]
    public string Region { get; set; } = "tool-form";

    /// <summary>Submit button label.</summary>
    [Parameter]
    public string? SubmitLabel { get; set; }

    /// <summary>Controls whether a submit button is rendered: in both modes, only in the static form, or never.</summary>
    [Parameter]
    public SiteToolFormSubmit Submit { get; set; } = SiteToolFormSubmit.StaticOnly;

    /// <summary>Click handler for the interactive submit button (Submit=Always only).</summary>
    [Parameter]
    public EventCallback OnSubmit { get; set; }

    /// <summary>Forces the static or interactive branch, bypassing RendererInfo.IsInteractive.</summary>
    [Parameter]
    public SiteFormMode Mode { get; set; } = SiteFormMode.Auto;

    /// <summary>Extra content rendered after the submit button, e.g. a reset link.</summary>
    [Parameter]
    public RenderFragment? Actions { get; set; }

    /// <summary>Extra class applied to the form card.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private string RootClass => SiteCss.Join("site-block", "site-tool-form-card", Class);

    private bool ResolvedInteractive =>
        Mode switch
        {
            SiteFormMode.Static => false,
            SiteFormMode.Interactive => true,
            _ => RendererInfo.IsInteractive,
        };

    private Task HandleSubmit() => OnSubmit.InvokeAsync();
}
