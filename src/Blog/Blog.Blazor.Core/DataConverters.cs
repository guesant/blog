using System.Text;
using System.Text.Json;

namespace Blog.Blazor.Core;

public readonly record struct DataConverterResult(
    bool IsValid,
    string Output,
    string? Error = null
);

public static class DataConverter
{
    public const int MaximumCharacters = 200_000;

    public static DataConverterResult FormatJson(string? input)
    {
        if (!WithinLimit(input))
            return Invalid("input-size-limit");
        try
        {
            using var document = JsonDocument.Parse(input ?? string.Empty);
            return new DataConverterResult(
                true,
                JsonSerializer.Serialize(
                    document.RootElement,
                    new JsonSerializerOptions { WriteIndented = true }
                )
            );
        }
        catch (JsonException)
        {
            return Invalid("invalid-json");
        }
    }

    public static DataConverterResult JsonToCsv(string? input)
    {
        if (!WithinLimit(input))
            return Invalid("input-size-limit");
        try
        {
            using var document = JsonDocument.Parse(input ?? string.Empty);
            if (
                document.RootElement.ValueKind != JsonValueKind.Array
                || document
                    .RootElement.EnumerateArray()
                    .Any(item => item.ValueKind != JsonValueKind.Object)
            )
            {
                return Invalid("expected-object-array");
            }

            var items = document.RootElement.EnumerateArray().ToArray();
            var headers = items
                .SelectMany(item => item.EnumerateObject().Select(property => property.Name))
                .Distinct(StringComparer.Ordinal)
                .ToArray();
            var builder = new StringBuilder();
            builder.AppendLine(string.Join(',', headers.Select(Escape)));
            foreach (var item in items)
            {
                builder.AppendLine(
                    string.Join(
                        ',',
                        headers.Select(header =>
                            item.TryGetProperty(header, out var value)
                                ? Escape(Value(value))
                                : string.Empty
                        )
                    )
                );
            }

            return new DataConverterResult(true, builder.ToString());
        }
        catch (JsonException)
        {
            return Invalid("invalid-json");
        }
    }

    private static string Value(JsonElement value) =>
        value.ValueKind switch
        {
            JsonValueKind.String => value.GetString() ?? string.Empty,
            JsonValueKind.Null => string.Empty,
            _ => value.GetRawText(),
        };

    private static string Escape(string value) =>
        value.Contains(',', StringComparison.Ordinal)
        || value.Contains('"')
        || value.Contains('\n')
        || value.Contains('\r')
            ? $"\"{value.Replace("\"", "\"\"", StringComparison.Ordinal)}\""
            : value;

    private static bool WithinLimit(string? input) => (input?.Length ?? 0) <= MaximumCharacters;

    private static DataConverterResult Invalid(string error) => new(false, string.Empty, error);
}
