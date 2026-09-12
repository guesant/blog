namespace Blog.Blazor.UI.Navigation;

public partial class SiteThemeSwitch
{
    /// <summary>Accessible name of the whole group, e.g. "theme".</summary>
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary>Label for the "follow the operating system" option.</summary>
    [Parameter, EditorRequired]
    public string SystemLabel { get; set; } = string.Empty;

    /// <summary>Label for the forced light option.</summary>
    [Parameter, EditorRequired]
    public string LightLabel { get; set; } = string.Empty;

    /// <summary>Label for the forced dark option.</summary>
    [Parameter, EditorRequired]
    public string DarkLabel { get; set; } = string.Empty;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>The preference lives in the browser (localStorage), so the active state is stamped by
    /// theme.js after render; this component only renders the three static buttons.</summary>
    private IEnumerable<(string Value, string Icon, string Label)> Options =>
        [
            ("system", "monitor", SystemLabel),
            ("light", "sun", LightLabel),
            ("dark", "moon", DarkLabel),
        ];
}
