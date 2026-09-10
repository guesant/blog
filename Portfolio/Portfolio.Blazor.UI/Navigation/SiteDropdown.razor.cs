namespace Portfolio.Blazor.UI.Navigation;

public partial class SiteDropdown
{
    [Parameter, EditorRequired]
    public RenderFragment ToggleContent { get; set; } = default!;

    [Parameter, EditorRequired]
    public RenderFragment MenuContent { get; set; } = default!;

    [Parameter]
    public string? ExclusiveGroup { get; set; }

    private Dictionary<string, object> TriggerAttributes { get; } =
        new()
        {
            ["class"] = "site-control",
            ["data-slot"] = "button",
            ["data-variant"] = "outline",
            ["data-size"] = "default",
        };

    private Dictionary<string, object> ContentAttributes { get; } =
        new() { ["class"] = "content-actions-menu-items" };

    // IMPORTANT: BbDropdownMenuContent already sets its own role="menu" internally, so the shared
    // ContentAttributes above stays generic. The <details> fallback renders a plain <div> with no
    // ARIA role of its own, so it needs one added explicitly here - see SiteDropdown.razor's IMPORTANT
    // comment above for why this fallback exists and content-actions.js for its keyboard behavior.
    private Dictionary<string, object> StaticContentAttributes { get; } =
        new() { ["class"] = "content-actions-menu-items", ["role"] = "menu" };
}
