namespace Portfolio.Blazor.UI.Navigation;

public partial class SiteToggleLink
{
    [Parameter, EditorRequired]
    public string Href { get; set; } = string.Empty;

    [Parameter]
    public bool Active { get; set; }

    /// <summary>aria-current value applied when Active is true. Defaults to "page" (this component's
    /// only real use today is language-switch links that do navigate); pass "true"/"step"/etc. for a
    /// toggle group that isn't page navigation.</summary>
    [Parameter]
    public string AriaCurrentValue { get; set; } = "page";

    /// <summary>Stretches the link to fill its flex container. Inside a SiteToggleGroup this is
    /// already applied to every child unconditionally, so it only matters when used standalone.</summary>
    [Parameter]
    public bool Fill { get; set; }

    [Parameter]
    public SiteButtonSize Size { get; set; } = SiteButtonSize.Default;

    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private string ToggleClass =>
        string.Join(
            ' ',
            new[]
            {
                "site-toggle-link",
                Active ? "active" : string.Empty,
                Fill ? "flex-fill" : string.Empty,
                Class,
            }.Where(value => !string.IsNullOrWhiteSpace(value))
        );
}
