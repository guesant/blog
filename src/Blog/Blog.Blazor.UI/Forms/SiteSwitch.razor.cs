namespace Blog.Blazor.UI.Forms;

public partial class SiteSwitch
{
    /// <summary>Visible label rendered next to the switch.</summary>
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    [Parameter]
    public bool Value { get; set; }

    [Parameter]
    public EventCallback<bool> ValueChanged { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    private string RootClass => SiteCss.Join("site-switch", Class);

    private Dictionary<string, object> SwitchAttributes
    {
        get
        {
            var attributes = new Dictionary<string, object> { ["class"] = "site-switch-track" };
            if (!string.IsNullOrWhiteSpace(ResolvedId))
            {
                attributes["id"] = ResolvedId!;
            }

            if (!string.IsNullOrWhiteSpace(Name))
            {
                attributes["name"] = Name!;
            }

            if (FieldContext?.DescribedBy is { } describedBy)
            {
                attributes["aria-describedby"] = describedBy;
            }

            return attributes;
        }
    }

    private static readonly Dictionary<string, object> ThumbAttributes = new()
    {
        ["class"] = "site-switch-thumb",
    };

    private Task HandleChanged(bool value) => ValueChanged.InvokeAsync(value);
}
