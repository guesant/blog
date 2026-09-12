using BlazorBlueprint.Primitives;

namespace Blog.Blazor.UI.Feedback;

public partial class SiteTooltip
{
    /// <summary>Tooltip content text.</summary>
    [Parameter, EditorRequired]
    public string Text { get; set; } = string.Empty;

    /// <summary>Preferred placement relative to the trigger.</summary>
    [Parameter]
    public PopoverSide? Side { get; set; }

    /// <summary>The trigger element the tooltip is attached to.</summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private Dictionary<string, object> ContentAttributes { get; } =
        new() { ["class"] = "site-tooltip-content", ["data-slot"] = "tooltip-content" };
}
