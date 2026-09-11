using System.Text.Json;

namespace Portfolio.Blazor.UI.Forms;

public partial class SiteStringListInput
{
    [Parameter]
    public string? Id { get; set; }

    [Parameter]
    public string? Value { get; set; }

    [Parameter]
    public EventCallback<string?> ValueChanged { get; set; }

    [Parameter]
    public string AddLabel { get; set; } = "add item";

    [Parameter]
    public string RemoveLabel { get; set; } = "remove";

    private readonly List<string> _items = [];
    private string? _lastParsedValue;

    protected override void OnParametersSet()
    {
        if (Value == _lastParsedValue)
            return;

        _lastParsedValue = Value;
        _items.Clear();

        if (string.IsNullOrWhiteSpace(Value))
            return;

        try
        {
            using var document = JsonDocument.Parse(Value);
            if (document.RootElement.ValueKind != JsonValueKind.Array)
                return;

            foreach (var element in document.RootElement.EnumerateArray())
            {
                _items.Add(
                    element.ValueKind == JsonValueKind.String
                        ? element.GetString() ?? string.Empty
                        : element.GetRawText()
                );
            }
        }
        catch (JsonException) { }
    }

    private void HandleChanged(int index, string value)
    {
        _items[index] = value;
        NotifyChanged();
    }

    private void AddItem()
    {
        _items.Add(string.Empty);
        NotifyChanged();
    }

    private void RemoveItem(int index)
    {
        _items.RemoveAt(index);
        NotifyChanged();
    }

    private void NotifyChanged()
    {
        var populated = _items.Where(item => !string.IsNullOrWhiteSpace(item)).ToList();
        var serialized = populated.Count == 0 ? null : Serialize(populated);
        _lastParsedValue = serialized;
        _ = ValueChanged.InvokeAsync(serialized);
    }

    private static string Serialize(List<string> items)
    {
        using var stream = new MemoryStream();
        using (var writer = new Utf8JsonWriter(stream))
        {
            writer.WriteStartArray();
            foreach (var item in items)
            {
                writer.WriteStringValue(item);
            }
            writer.WriteEndArray();
        }
        return System.Text.Encoding.UTF8.GetString(stream.ToArray());
    }
}
