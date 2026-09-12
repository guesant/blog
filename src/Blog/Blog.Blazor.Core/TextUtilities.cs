using System.Globalization;
using System.Text;

namespace Blog.Blazor.Core;

public enum TextUtilityMode
{
    Reverse,
    RemoveLineBreaks,
    TrimWhitespace,
    RemoveDuplicateLines,
    RemoveAccents,
    Slugify,
    Repeat,
}

public readonly record struct TextUtilityResult(bool IsValid, string Output, string? Error = null);

public static class TextUtilityCalculator
{
    public const int MaximumRepeatCount = 100;
    public const int MaximumInputCharacters = 200_000;

    public static TextUtilityResult Transform(
        string? input,
        TextUtilityMode mode,
        int repeatCount = 1
    )
    {
        var text = input ?? string.Empty;
        if (text.Length > MaximumInputCharacters)
        {
            return new TextUtilityResult(false, string.Empty, "input-size-limit");
        }

        if (mode == TextUtilityMode.Repeat && repeatCount is < 1 or > MaximumRepeatCount)
        {
            return new TextUtilityResult(false, string.Empty, "repeat-count-limit");
        }

        if (
            mode == TextUtilityMode.Repeat
            && (long)text.Length * repeatCount > MaximumInputCharacters
        )
        {
            return new TextUtilityResult(false, string.Empty, "output-size-limit");
        }

        var output = mode switch
        {
            TextUtilityMode.Reverse => Reverse(text),
            TextUtilityMode.RemoveLineBreaks => string.Join(' ', Lines(text)),
            TextUtilityMode.TrimWhitespace => string.Join(
                '\n',
                Lines(text).Select(line => line.Trim())
            ),
            TextUtilityMode.RemoveDuplicateLines => RemoveDuplicateLines(text),
            TextUtilityMode.RemoveAccents => RemoveAccents(text),
            TextUtilityMode.Slugify => Slugify(text),
            TextUtilityMode.Repeat => string.Join('\n', Enumerable.Repeat(text, repeatCount)),
            _ => text,
        };

        return new TextUtilityResult(true, output);
    }

    private static IEnumerable<string> Lines(string text) =>
        text.Replace("\r\n", "\n").Replace('\r', '\n').Split('\n');

    private static string Reverse(string text) => string.Concat(text.EnumerateRunes().Reverse());

    private static string RemoveDuplicateLines(string text)
    {
        var seen = new HashSet<string>(StringComparer.Ordinal);
        return string.Join('\n', Lines(text).Where(seen.Add));
    }

    private static string RemoveAccents(string text)
    {
        var normalized = text.Normalize(NormalizationForm.FormD);
        return string.Concat(
                normalized.Where(character =>
                    CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark
                )
            )
            .Normalize(NormalizationForm.FormC);
    }

    private static string Slugify(string text)
    {
        var withoutAccents = RemoveAccents(text).ToLowerInvariant();
        var builder = new StringBuilder();
        var pendingSeparator = false;
        foreach (var character in withoutAccents)
        {
            if (char.IsLetterOrDigit(character))
            {
                if (pendingSeparator && builder.Length > 0)
                {
                    builder.Append('-');
                }

                builder.Append(character);
                pendingSeparator = false;
            }
            else if (builder.Length > 0)
            {
                pendingSeparator = true;
            }
        }

        return builder.ToString();
    }
}
