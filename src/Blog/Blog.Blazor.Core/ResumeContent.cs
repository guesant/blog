using System.Text.Json;

namespace Blog.Blazor.Core;

public static class ResumeContent
{
    public static bool HasContent(JsonElement resume) =>
        !string.IsNullOrWhiteSpace(Field(resume, "summary"))
        || VisibleRows(resume, "leadership").Count > 0
        || VisibleRows(resume, "experience").Count > 0
        || ReadArray(resume, "selected_cases").Count > 0
        || ReadArray(resume, "skills").Count > 0
        || VisibleRows(resume, "education").Count > 0
        || ReadArray(resume, "languages").Count > 0;

    public static string Field(JsonElement resume, string name) =>
        PublicContentFields.String(resume, name);

    public static IReadOnlyList<JsonElement> ReadArray(JsonElement resume, string name) =>
        resume.ValueKind == JsonValueKind.Object
        && resume.TryGetProperty(name, out var value)
        && value.ValueKind == JsonValueKind.Array
            ? value.EnumerateArray().ToArray()
            : [];

    public static IReadOnlyList<JsonElement> VisibleRows(JsonElement resume, string name) =>
        ReadArray(resume, name)
            .Where(IsVisibleEntry)
            .Where(row =>
                !name.Equals("experience", StringComparison.OrdinalIgnoreCase)
                || IsIncludedInResume(row)
            )
            .ToArray();

    public static bool IsVisibleEntry(JsonElement value) =>
        !value.TryGetProperty("hidden", out var hidden) || hidden.ValueKind != JsonValueKind.True;

    public static bool IsIncludedInResume(JsonElement value) =>
        value.TryGetProperty("includeInResume", out var included)
        && included.ValueKind == JsonValueKind.True;

    public static string StringValue(JsonElement value, string key) =>
        PublicContentFields.String(value, key);

    public static IReadOnlyList<string> StringArray(JsonElement value, string key) =>
        value.ValueKind == JsonValueKind.Object
        && value.TryGetProperty(key, out var field)
        && field.ValueKind == JsonValueKind.Array
            ? field
                .EnumerateArray()
                .Where(item => item.ValueKind == JsonValueKind.String)
                .Select(item => item.GetString() ?? string.Empty)
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .ToArray()
            : [];
}
