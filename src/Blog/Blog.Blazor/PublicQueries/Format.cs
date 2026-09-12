using System.Globalization;

namespace Blog.Blazor.PublicQueries;

internal static class Format
{
    internal static string Timestamp(DateTime? value) =>
        value?.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture) ?? string.Empty;

    internal static string Timestamp(DateOnly? value) => Date(value);

    internal static string Date(DateTime? value) =>
        value?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty;

    internal static string Date(DateOnly? value) =>
        value?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty;

    internal static string Id(int value) => value.ToString(CultureInfo.InvariantCulture);

    internal static string Text(string? value) => value ?? string.Empty;
}
