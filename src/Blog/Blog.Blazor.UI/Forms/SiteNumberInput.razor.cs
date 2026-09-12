namespace Blog.Blazor.UI.Forms;

public partial class SiteNumberInput<TValue>
{
    [Parameter]
    public TValue Value { get; set; } = default!;

    [Parameter]
    public EventCallback<TValue> ValueChanged { get; set; }

    [Parameter]
    public double Step { get; set; } = 1;

    [Parameter]
    public TValue? Min { get; set; }

    [Parameter]
    public TValue? Max { get; set; }

    protected override IReadOnlySet<string> ExcludedAttributeKeys { get; } =
        new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "class",
            "id",
            "name",
            "value",
            "type",
            "step",
            "min",
            "max",
        };

    private static string FormatValue(TValue? value) =>
        value is null
            ? string.Empty
            : Convert.ToString(value, System.Globalization.CultureInfo.InvariantCulture)
                ?? string.Empty;

    private Task HandleInput(ChangeEventArgs args)
    {
        if (
            !Microsoft.AspNetCore.Components.BindConverter.TryConvertTo<TValue>(
                args.Value?.ToString(),
                System.Globalization.CultureInfo.InvariantCulture,
                out var value
            )
        )
        {
            return Task.CompletedTask;
        }

        Value = value;
        return ValueChanged.InvokeAsync(value);
    }
}
