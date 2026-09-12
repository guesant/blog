using System.Text.Json;

namespace Blog.Blazor.UI.Forms;

public partial class SiteJsonArrayInput
{
    [Parameter]
    public string? Id { get; set; }

    [Parameter]
    public string? Value { get; set; }

    [Parameter]
    public EventCallback<string?> ValueChanged { get; set; }

    /// <summary>Keys every item should offer, in order; suffix ":bool" renders a checkbox. Without
    /// this the schema is inferred from the existing items, so an empty array has no fields and a
    /// newly added item would render with nothing to fill in.</summary>
    [Parameter]
    public IReadOnlyList<string>? Fields { get; set; }

    [Parameter]
    public string AddLabel { get; set; } = "add item";

    [Parameter]
    public string RemoveLabel { get; set; } = "remove";

    private enum FieldKind
    {
        String,
        Bool,
        Number,
        List,
        Raw,
    }

    private sealed class FieldSlot
    {
        public required string Key { get; init; }
        public FieldKind Kind { get; set; }
    }

    public sealed class FieldValue
    {
        public string Text { get; set; } = string.Empty;
        public bool Bool { get; set; }
    }

    private readonly List<FieldSlot> _fields = [];
    private readonly List<List<FieldValue>> _items = [];
    private string? _lastParsedValue;

    protected override void OnParametersSet()
    {
        if (Value == _lastParsedValue)
            return;

        _lastParsedValue = Value;
        _fields.Clear();
        _items.Clear();
        SeedDeclaredFields();

        if (string.IsNullOrWhiteSpace(Value))
            return;

        try
        {
            using var document = JsonDocument.Parse(Value);
            if (document.RootElement.ValueKind != JsonValueKind.Array)
                return;

            var elements = document
                .RootElement.EnumerateArray()
                .Where(element => element.ValueKind == JsonValueKind.Object)
                .ToList();

            foreach (var element in elements)
            {
                foreach (var property in element.EnumerateObject())
                {
                    var slot = _fields.FirstOrDefault(field => field.Key == property.Name);
                    if (slot is null)
                    {
                        slot = new FieldSlot { Key = property.Name };
                        _fields.Add(slot);
                    }
                    slot.Kind = MergeKind(slot.Kind, KindOf(property.Value));
                }
            }

            foreach (var element in elements)
            {
                var row = new List<FieldValue>(_fields.Count);
                foreach (var field in _fields)
                {
                    var value = new FieldValue();
                    if (element.TryGetProperty(field.Key, out var property))
                    {
                        if (field.Kind == FieldKind.Bool)
                        {
                            value.Bool = property.ValueKind == JsonValueKind.True;
                        }
                        else
                        {
                            value.Text =
                                property.ValueKind == JsonValueKind.String
                                    ? property.GetString() ?? string.Empty
                                    : property.GetRawText();
                        }
                    }
                    row.Add(value);
                }
                _items.Add(row);
            }
        }
        catch (JsonException) { }
    }

    private void SeedDeclaredFields()
    {
        foreach (var declared in Fields ?? [])
        {
            var parts = declared.Split(':', 2);
            var key = parts[0].Trim();
            if (key.Length == 0 || _fields.Any(field => field.Key == key))
                continue;
            _fields.Add(
                new FieldSlot
                {
                    Key = key,
                    Kind = parts.Length > 1 ? DeclaredKind(parts[1]) : FieldKind.String,
                }
            );
        }
    }

    private static FieldKind DeclaredKind(string suffix) =>
        suffix.Trim().ToLowerInvariant() switch
        {
            "bool" => FieldKind.Bool,
            "list" => FieldKind.List,
            _ => FieldKind.String,
        };

    private static FieldKind KindOf(JsonElement value) =>
        value.ValueKind switch
        {
            JsonValueKind.True or JsonValueKind.False => FieldKind.Bool,
            JsonValueKind.Number => FieldKind.Number,
            JsonValueKind.String => FieldKind.String,
            JsonValueKind.Array
                when value.EnumerateArray().All(item => item.ValueKind == JsonValueKind.String) =>
                FieldKind.List,
            _ => FieldKind.Raw,
        };

    private static FieldKind MergeKind(FieldKind current, FieldKind observed)
    {
        if (current == FieldKind.Bool || observed == FieldKind.Bool)
            return FieldKind.Bool;
        if (current == FieldKind.List && observed == FieldKind.List)
            return FieldKind.List;
        if (current == FieldKind.List || observed == FieldKind.List)
            return FieldKind.Raw;
        if (current == FieldKind.Raw || observed == FieldKind.Raw)
            return FieldKind.Raw;
        if (current == FieldKind.Number && observed == FieldKind.Number)
            return FieldKind.Number;
        return FieldKind.String;
    }

    // IMPORTANT: this key list is a heuristic tuned to the JSON shapes this component is actually
    // fed today (resume/profile entries keyed name/title/institution/label) - it is not a generic
    // "find the display field" algorithm. A future array shape whose natural display key isn't one
    // of these four falls back to "item N" rather than picking something wrong.
    private string GetItemTitle(List<FieldValue> item, int index)
    {
        foreach (var key in new[] { "name", "title", "institution", "label" })
        {
            var slotIndex = _fields.FindIndex(field =>
                string.Equals(field.Key, key, StringComparison.OrdinalIgnoreCase)
            );
            if (slotIndex >= 0 && !string.IsNullOrWhiteSpace(item[slotIndex].Text))
                return item[slotIndex].Text;
        }
        return $"item {index + 1}";
    }

    private void HandleTextChanged(int itemIndex, int fieldIndex, string value)
    {
        _items[itemIndex][fieldIndex].Text = value;
        NotifyChanged();
    }

    private void HandleBoolChanged(int itemIndex, int fieldIndex, bool value)
    {
        _items[itemIndex][fieldIndex].Bool = value;
        NotifyChanged();
    }

    private void AddItem()
    {
        _items.Add(_fields.Select(_ => new FieldValue()).ToList());
        NotifyChanged();
    }

    private void RemoveItem(int index)
    {
        _items.RemoveAt(index);
        NotifyChanged();
    }

    private void NotifyChanged()
    {
        var serialized = _items.Count == 0 ? null : Serialize();
        _lastParsedValue = serialized;
        _ = ValueChanged.InvokeAsync(serialized);
    }

    private string Serialize()
    {
        using var stream = new MemoryStream();
        using (var writer = new Utf8JsonWriter(stream))
        {
            writer.WriteStartArray();
            foreach (var item in _items)
            {
                writer.WriteStartObject();
                for (var i = 0; i < _fields.Count; i++)
                {
                    var field = _fields[i];
                    var value = item[i];
                    switch (field.Kind)
                    {
                        case FieldKind.Bool:
                            writer.WriteBoolean(field.Key, value.Bool);
                            break;
                        case FieldKind.Number when double.TryParse(value.Text, out var number):
                            writer.WriteNumber(field.Key, number);
                            break;
                        case FieldKind.Raw:
                            WriteRawOrString(writer, field.Key, value.Text);
                            break;
                        case FieldKind.List when string.IsNullOrWhiteSpace(value.Text):
                            writer.WriteStartArray(field.Key);
                            writer.WriteEndArray();
                            break;
                        case FieldKind.List:
                            WriteRawOrString(writer, field.Key, value.Text);
                            break;
                        default:
                            writer.WriteString(field.Key, value.Text);
                            break;
                    }
                }
                writer.WriteEndObject();
            }
            writer.WriteEndArray();
        }
        return System.Text.Encoding.UTF8.GetString(stream.ToArray());
    }

    private static void WriteRawOrString(Utf8JsonWriter writer, string key, string text)
    {
        try
        {
            using var document = JsonDocument.Parse(text);
            writer.WritePropertyName(key);
            document.RootElement.WriteTo(writer);
        }
        catch (JsonException)
        {
            writer.WriteString(key, text);
        }
    }
}
