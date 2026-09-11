namespace Portfolio.Blazor.UI.Navigation;

public partial class SiteDropdown
{
    [Parameter, EditorRequired]
    public RenderFragment ToggleContent { get; set; } = default!;

    [Parameter, EditorRequired]
    public RenderFragment MenuContent { get; set; } = default!;

    [Parameter]
    public string? ExclusiveGroup { get; set; }

    /// <summary>Opens the menu aligned to the trigger's right edge instead of its left edge.</summary>
    [Parameter]
    public bool AlignEnd { get; set; }

    /// <summary>Renders the trigger as a small square icon button; the label becomes its aria-label.</summary>
    [Parameter]
    public string? IconTriggerLabel { get; set; }

    private Dictionary<string, object> TriggerAttributes
    {
        get
        {
            var attributes = new Dictionary<string, object>
            {
                ["class"] = "site-control",
                ["data-slot"] = "button",
                ["data-variant"] = "outline",
                ["data-size"] = IconTriggerLabel is null ? "default" : "icon-sm",
            };
            if (IconTriggerLabel is not null)
                attributes["aria-label"] = IconTriggerLabel;
            return attributes;
        }
    }

    private Dictionary<string, object> ContentAttributes { get; } =
        new() { ["class"] = "content-actions-menu-items" };

    // IMPORTANT: BbDropdownMenuContent already sets its own role="menu" internally, so the shared
    // ContentAttributes above stays generic. The <details> fallback renders a plain <div> with no
    // ARIA role of its own, so it needs one added explicitly here - see SiteDropdown.razor's IMPORTANT
    // comment above for why this fallback exists and content-actions.js for its keyboard behavior.
    private Dictionary<string, object> StaticContentAttributes { get; } =
        new() { ["class"] = "content-actions-menu-items", ["role"] = "menu" };
}
