using System.Text.Json;

namespace Blog.Blazor.Core;

public static class PublicContentFields
{
    public static string String(JsonElement value, string key, string fallback = "") =>
        value.ValueKind == JsonValueKind.Object
        && value.TryGetProperty(key, out var field)
        && field.ValueKind == JsonValueKind.String
            ? field.GetString() ?? fallback
            : fallback;

    public static string PageField(
        PublicSiteSnapshot snapshot,
        string slug,
        string name,
        string fallback = ""
    ) => snapshot.Pages.TryGetValue(slug, out var page) ? String(page, name, fallback) : fallback;
}
