namespace Blog.Blazor.UI.Forms;

public partial class SiteTextAreaInput
{
    [Parameter]
    public string Value { get; set; } = string.Empty;

    [Parameter]
    public EventCallback<string> ValueChanged { get; set; }

    [Parameter]
    public int Rows { get; set; } = 5;

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    private Task HandleInput(ChangeEventArgs args) =>
        ValueChanged.InvokeAsync(args.Value?.ToString() ?? string.Empty);
}
