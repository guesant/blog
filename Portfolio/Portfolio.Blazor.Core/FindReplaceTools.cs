using System.Text.RegularExpressions;

namespace Portfolio.Blazor.Core;

public sealed record FindReplaceResult(bool IsValid, string Output, string? Error);

public static class FindAndReplaceEngine
{
    public static FindReplaceResult Execute(
        string? input,
        string? find,
        string? replacement,
        bool caseSensitive,
        bool useRegex
    )
    {
        input ??= string.Empty;
        find ??= string.Empty;
        replacement ??= string.Empty;
        if (find.Length == 0)
            return new(true, input, null);
        try
        {
            var pattern = useRegex ? find : Regex.Escape(find);
            var options = caseSensitive ? RegexOptions.None : RegexOptions.IgnoreCase;
            var value = useRegex
                ? replacement
                : replacement.Replace("$", "$$", StringComparison.Ordinal);
            return new(true, Regex.Replace(input, pattern, value, options), null);
        }
        catch (ArgumentException exception)
        {
            return new(false, string.Empty, exception.Message);
        }
    }
}
