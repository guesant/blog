using System.Text.Json;
using Microsoft.AspNetCore.Components;

namespace Portfolio.Blazor.UI.Forms;

/// <summary>Shared JSON-object/rows plumbing for flat string key/value editors (SiteKeyValueInput, SiteContentFactInput).</summary>
public abstract class SiteKeyValueRowsInputBase : ComponentBase
{
    /// <summary>The bound JSON object, e.g. {"key":"value"}; null or blank renders no rows.</summary>
    [Parameter]
    public string? Value { get; set; }

    /// <summary>Raised with the reserialized JSON object after a row is added, removed or edited.</summary>
    [Parameter]
    public EventCallback<string?> ValueChanged { get; set; }

    /// <summary>Placeholder for a row's key input.</summary>
    [Parameter]
    public string KeyPlaceholder { get; set; } = "key";

    /// <summary>Placeholder for a row's value input.</summary>
    [Parameter]
    public string ValuePlaceholder { get; set; } = "value";

    /// <summary>Label for the add-row button.</summary>
    [Parameter]
    public string AddLabel { get; set; } = "add";

    /// <summary>Label for a row's remove button.</summary>
    [Parameter]
    public string RemoveLabel { get; set; } = "remove";

    /// <summary>The rows backing <see cref="Value"/>, in parse/insertion order.</summary>
    protected List<(string Key, string Value)> Rows { get; } = [];

    private string? _lastParsedValue;

    /// <summary>Reparses <see cref="Value"/> into <see cref="Rows"/>, unless it is the same value this component last parsed or emitted.</summary>
    protected override void OnParametersSet()
    {
        if (Value == _lastParsedValue)
            return;

        _lastParsedValue = Value;
        Rows.Clear();
        Rows.AddRange(Parse(Value));
    }

    /// <summary>Appends a new, empty row and notifies.</summary>
    protected void AddRow()
    {
        Rows.Add((string.Empty, string.Empty));
        NotifyChanged();
    }

    /// <summary>Removes the row at <paramref name="index"/> and notifies.</summary>
    protected void RemoveRow(int index)
    {
        Rows.RemoveAt(index);
        NotifyChanged();
    }

    /// <summary>Reserializes <see cref="Rows"/>, records the result as the last-parsed value so it isn't reparsed on the next render, and raises <see cref="ValueChanged"/>.</summary>
    protected void NotifyChanged()
    {
        var serialized = Serialize(Rows);
        _lastParsedValue = serialized;
        _ = ValueChanged.InvokeAsync(serialized);
    }

    private static List<(string Key, string Value)> Parse(string? json)
    {
        var rows = new List<(string Key, string Value)>();

        if (string.IsNullOrWhiteSpace(json))
            return rows;

        try
        {
            using var document = JsonDocument.Parse(json);
            if (document.RootElement.ValueKind != JsonValueKind.Object)
                return rows;

            foreach (var property in document.RootElement.EnumerateObject())
            {
                var text =
                    property.Value.ValueKind == JsonValueKind.String
                        ? property.Value.GetString() ?? string.Empty
                        : property.Value.GetRawText();
                rows.Add((property.Name, text));
            }
        }
        catch (JsonException) { }

        return rows;
    }

    private static string? Serialize(List<(string Key, string Value)> rows)
    {
        var populated = rows.Where(row => !string.IsNullOrWhiteSpace(row.Key)).ToList();
        if (populated.Count == 0)
            return null;

        using var stream = new MemoryStream();
        using (var writer = new Utf8JsonWriter(stream))
        {
            writer.WriteStartObject();
            foreach (var row in populated)
            {
                writer.WriteString(row.Key, row.Value);
            }
            writer.WriteEndObject();
        }
        return System.Text.Encoding.UTF8.GetString(stream.ToArray());
    }
}
