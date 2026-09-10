namespace Portfolio.Blazor.UI.Forms;

public partial class SiteCopyButton
{
    /// <summary>Text copied to the clipboard.</summary>
    [Parameter, EditorRequired]
    public string Value { get; set; } = string.Empty;

    /// <summary>Button label before copying.</summary>
    [Parameter]
    public string Label { get; set; } = string.Empty;

    /// <summary>Button label shown briefly after copying.</summary>
    [Parameter]
    public string CopiedLabel { get; set; } = "copied";

    /// <summary>Button size.</summary>
    [Parameter]
    public SiteButtonSize Size { get; set; } = SiteButtonSize.Sm;

    /// <summary>Tooltip text shown on hover/focus; defaults to the copy label.</summary>
    [Parameter]
    public string? TooltipText { get; set; }

    private string ResolvedTooltipText =>
        string.IsNullOrWhiteSpace(TooltipText) ? Label : TooltipText;

    [Inject]
    private IJSRuntime JS { get; set; } = default!;

    private bool _copied;

    private async Task HandleCopyAsync()
    {
        await JS.InvokeVoidAsync("navigator.clipboard.writeText", Value);
        _copied = true;
        _ = ResetAfterDelayAsync();
    }

    private async Task ResetAfterDelayAsync()
    {
        await Task.Delay(2000);
        _copied = false;
        StateHasChanged();
    }
}
