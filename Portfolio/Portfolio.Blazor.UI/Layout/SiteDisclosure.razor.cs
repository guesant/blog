namespace Portfolio.Blazor.UI.Layout;

public partial class SiteDisclosure
{
    [Parameter, EditorRequired]
    public string Summary { get; set; } = string.Empty;

    [Parameter]
    public bool Open { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    private bool _open;
    private bool _lastSeenOpen;
    private bool _initialized;

    // IMPORTANT: _open is the disclosure's own live state, toggled internally by the user via
    // HandleOpenChangedAsync. Open is the caller's parameter. Only resync _open from Open when the
    // caller's value actually changed since last render (_lastSeenOpen) - otherwise every re-render
    // caused by the disclosure's own internal toggle would immediately stomp _open back to the
    // caller's stale Open value.
    protected override void OnParametersSet()
    {
        if (!_initialized)
        {
            _open = Open;
            _lastSeenOpen = Open;
            _initialized = true;
            return;
        }

        if (Open != _lastSeenOpen)
        {
            _open = Open;
            _lastSeenOpen = Open;
        }
    }

    private Task HandleOpenChangedAsync(bool open)
    {
        _open = open;
        return Task.CompletedTask;
    }

    private string RootClass => SiteCss.Join("site-disclosure", Class);

    private Dictionary<string, object> TriggerAttributes =>
        new()
        {
            ["class"] = "site-disclosure-summary",
            ["aria-expanded"] = _open ? "true" : "false",
        };

    private static Dictionary<string, object> ContentAttributes =>
        new() { ["class"] = "site-disclosure-content" };

    private IReadOnlyDictionary<string, object> ForwardedAttributes =>
        AdditionalAttributes is null
            ? new Dictionary<string, object>()
            : AdditionalAttributes
                .Where(attribute =>
                    !attribute.Key.Equals("class", StringComparison.OrdinalIgnoreCase)
                    && !attribute.Key.Equals("open", StringComparison.OrdinalIgnoreCase)
                )
                .ToDictionary(attribute => attribute.Key, attribute => attribute.Value);
}
