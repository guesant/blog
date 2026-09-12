namespace Blog.Blazor.UI.Forms;

public partial class SiteInput
{
    [Parameter]
    public string Value { get; set; } = string.Empty;

    [Parameter]
    public EventCallback<string> ValueChanged { get; set; }

    [Parameter]
    public string Type { get; set; } = "text";

    [Parameter]
    public EventCallback<ChangeEventArgs> OnInput { get; set; }

    [Parameter]
    public EventCallback<ChangeEventArgs> OnChange { get; set; }

    protected override IReadOnlySet<string> ExcludedAttributeKeys { get; } =
        new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "class", "id", "name", "type" };

    private async Task HandleInput(ChangeEventArgs args)
    {
        await ValueChanged.InvokeAsync(args.Value?.ToString() ?? string.Empty);
        await OnInput.InvokeAsync(args);
    }

    private Task HandleChange(ChangeEventArgs args) => OnChange.InvokeAsync(args);
}
