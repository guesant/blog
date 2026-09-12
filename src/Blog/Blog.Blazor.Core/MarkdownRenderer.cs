using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace Blog.Blazor.Core;

public static partial class MarkdownRenderer
{
    public const int MaximumCharacters = 200_000;

    public static string ToHtml(string? markdown)
    {
        var text = markdown ?? string.Empty;
        if (text.Length > MaximumCharacters)
        {
            text = text[..MaximumCharacters];
        }

        var builder = new StringBuilder();
        var inList = false;
        var inCode = false;
        foreach (var rawLine in text.Replace("\r\n", "\n").Replace('\r', '\n').Split('\n'))
        {
            var line = rawLine.TrimEnd();
            if (line.StartsWith("```", StringComparison.Ordinal) && !inCode)
            {
                builder.Append("<pre><code>");
                inCode = true;
                continue;
            }

            if (line.StartsWith("```", StringComparison.Ordinal) && inCode)
            {
                builder.Append("</code></pre>");
                inCode = false;
                continue;
            }

            if (inCode)
            {
                builder.Append(WebUtility.HtmlEncode(line)).Append('\n');
                continue;
            }

            var heading = HeadingPattern().Match(line);
            if (heading.Success)
            {
                CloseList(builder, ref inList);
                var level = heading.Groups[1].Value.Length;
                builder
                    .Append("<h")
                    .Append(level)
                    .Append('>')
                    .Append(Inline(heading.Groups[2].Value))
                    .Append("</h")
                    .Append(level)
                    .Append('>');
                continue;
            }

            var listItem = ListPattern().Match(line);
            if (listItem.Success)
            {
                if (!inList)
                {
                    builder.Append("<ul>");
                    inList = true;
                }

                builder.Append("<li>").Append(Inline(listItem.Groups[1].Value)).Append("</li>");
                continue;
            }

            CloseList(builder, ref inList);
            if (string.IsNullOrWhiteSpace(line))
            {
                continue;
            }

            builder.Append("<p>").Append(Inline(line)).Append("</p>");
        }

        CloseList(builder, ref inList);
        if (inCode)
        {
            builder.Append("</code></pre>");
        }

        return builder.ToString();
    }

    private static string Inline(string value)
    {
        var encoded = WebUtility.HtmlEncode(value);
        encoded = LinkPattern()
            .Replace(
                encoded,
                match =>
                    $"<a href=\"{WebUtility.HtmlEncode(match.Groups[2].Value)}\">{match.Groups[1].Value}</a>"
            );
        encoded = BoldPattern().Replace(encoded, "<strong>$1</strong>");
        return encoded.Replace("  ", "<br>", StringComparison.Ordinal);
    }

    private static void CloseList(StringBuilder builder, ref bool inList)
    {
        if (inList)
        {
            builder.Append("</ul>");
            inList = false;
        }
    }

    [GeneratedRegex("^(#{1,6})\\s+(.+)$")]
    private static partial Regex HeadingPattern();

    [GeneratedRegex("^\\s*[-*+]\\s+(.+)$")]
    private static partial Regex ListPattern();

    [GeneratedRegex("\\[([^\\]]+)\\]\\(((?:https?://|/)[^\\)]+)\\)")]
    private static partial Regex LinkPattern();

    [GeneratedRegex("\\*\\*([^*]+)\\*\\*")]
    private static partial Regex BoldPattern();
}
