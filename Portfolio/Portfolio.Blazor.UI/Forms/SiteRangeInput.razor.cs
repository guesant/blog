namespace Portfolio.Blazor.UI.Forms;

public partial class SiteRangeInput
{
    [Parameter]
    public int Value { get; set; }

    [Parameter]
    public EventCallback<int> ValueChanged { get; set; }

    /// <summary>Renders the current numeric value next to the slider. Off by default since several
    /// callers already render their own value readout elsewhere in the page.</summary>
    [Parameter]
    public bool ShowValue { get; set; }

    protected override string BaseInputClass => "form-range";

    private Task HandleInput(ChangeEventArgs args) =>
        int.TryParse(args.Value?.ToString(), out var value)
            ? ValueChanged.InvokeAsync(value)
            : Task.CompletedTask;
}
