using System.Text.RegularExpressions;

namespace Blog.Blazor.Core;

public static partial class PlainTextExcerpt
{
    public static (string Text, bool Truncated) From(string? markdown, int maxCharacters)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxCharacters);
        if (string.IsNullOrWhiteSpace(markdown))
            return (string.Empty, false);

        var text = markdown.Replace("\r\n", "\n").Replace('\r', '\n');
        text = CodeBlockPattern().Replace(text, " ");
        text = HeadingMarkerPattern().Replace(text, string.Empty);
        text = ListMarkerPattern().Replace(text, string.Empty);
        text = LinkPattern().Replace(text, "$1");
        text = EmphasisPattern().Replace(text, "$1");
        text = InlineCodePattern().Replace(text, "$1");
        text = HtmlTagPattern().Replace(text, " ");
        text = WhitespacePattern().Replace(text, " ").Trim();

        if (text.Length <= maxCharacters)
            return (text, false);

        var cut = text.LastIndexOf(' ', maxCharacters);
        if (cut < maxCharacters / 2)
            cut = maxCharacters;

        return (text[..cut].TrimEnd(' ', ',', ';', ':', '-'), true);
    }

    [GeneratedRegex("```[\\s\\S]*?```")]
    private static partial Regex CodeBlockPattern();

    [GeneratedRegex("(?m)^#{1,6}\\s+")]
    private static partial Regex HeadingMarkerPattern();

    [GeneratedRegex("(?m)^\\s*(?:[-*+]|\\d+\\.)\\s+")]
    private static partial Regex ListMarkerPattern();

    [GeneratedRegex("\\[([^\\]]+)\\]\\([^\\)]*\\)")]
    private static partial Regex LinkPattern();

    [GeneratedRegex("(?:\\*\\*|__|\\*|_)([^*_]+)(?:\\*\\*|__|\\*|_)")]
    private static partial Regex EmphasisPattern();

    [GeneratedRegex("`([^`]+)`")]
    private static partial Regex InlineCodePattern();

    [GeneratedRegex("<[^>]+>")]
    private static partial Regex HtmlTagPattern();

    [GeneratedRegex("\\s+")]
    private static partial Regex WhitespacePattern();
}
