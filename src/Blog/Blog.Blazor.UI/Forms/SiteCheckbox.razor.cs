namespace Blog.Blazor.UI.Forms;

public partial class SiteCheckbox
{
    /// <summary>Visible label rendered next to the checkbox.</summary>
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    [Parameter]
    public bool Value { get; set; }

    [Parameter]
    public EventCallback<bool> ValueChanged { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    /// <summary>Raw HTML "value" submitted for this checkbox, distinct from the checked state. Needed for checkbox groups (shared Name, one value per option) and for static forms whose query binder expects a specific literal (e.g. "true" instead of the browser default "on").</summary>
    [Parameter]
    public string? HtmlValue { get; set; }
    private string RootClass => SiteCss.Join("form-check", Class);

    private Task HandleChange(ChangeEventArgs args) =>
        ValueChanged.InvokeAsync(args.Value is bool value && value);
}
