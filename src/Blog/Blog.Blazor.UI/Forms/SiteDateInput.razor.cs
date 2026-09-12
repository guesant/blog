namespace Blog.Blazor.UI.Forms;

public partial class SiteDateInput
{
    [Parameter]
    public DateOnly? Value { get; set; }

    [Parameter]
    public EventCallback<DateOnly?> ValueChanged { get; set; }

    private Task HandleChange(ChangeEventArgs args) =>
        DateOnly.TryParse(args.Value?.ToString(), out var value)
            ? ValueChanged.InvokeAsync(value)
            : Task.CompletedTask;
}
