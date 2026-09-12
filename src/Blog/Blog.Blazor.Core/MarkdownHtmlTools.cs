using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace Blog.Blazor.Core;

public static class MarkdownHtmlConverter
{
    public static string Convert(string? source)
    {
        var lines = (source ?? string.Empty).Replace("\r\n", "\n").Split('\n');
        var html = new List<string>();
        for (var index = 0; index < lines.Length; )
        {
            var line = lines[index];
            if (string.IsNullOrWhiteSpace(line))
            {
                index++;
                continue;
            }
            if (line.StartsWith("```", StringComparison.Ordinal))
            {
                var code = new List<string>();
                index++;
                while (
                    index < lines.Length
                    && !lines[index].StartsWith("```", StringComparison.Ordinal)
                )
                    code.Add(lines[index++]);
                if (index < lines.Length)
                    index++;
                html.Add($"<pre><code>{Escape(string.Join('\n', code))}</code></pre>");
                continue;
            }
            var heading = Regex.Match(line, "^(#{1,6})\\s+(.*)$");
            if (heading.Success)
            {
                var level = heading.Groups[1].Length;
                html.Add($"<h{level}>{Inline(heading.Groups[2].Value.Trim())}</h{level}>");
                index++;
                continue;
            }
            if (Regex.IsMatch(line, "^(-{3,}|\\*{3,}|_{3,})\\s*$"))
            {
                html.Add("<hr>");
                index++;
                continue;
            }
            if (Regex.IsMatch(line, "^>\\s?"))
            {
                var quote = new List<string>();
                while (index < lines.Length && Regex.IsMatch(lines[index], "^>\\s?"))
                    quote.Add(Regex.Replace(lines[index++], "^>\\s?", ""));
                html.Add($"<blockquote><p>{Inline(string.Join(' ', quote))}</p></blockquote>");
                continue;
            }
            if (Regex.IsMatch(line, "^\\s*[-*+]\\s+"))
            {
                html.Add($"<ul>{CollectList(lines, ref index, false)}</ul>");
                continue;
            }
            if (Regex.IsMatch(line, "^\\s*\\d+\\.\\s+"))
            {
                html.Add($"<ol>{CollectList(lines, ref index, true)}</ol>");
                continue;
            }
            var paragraph = new List<string>();
            while (
                index < lines.Length
                && !string.IsNullOrWhiteSpace(lines[index])
                && !lines[index].StartsWith("```", StringComparison.Ordinal)
                && !Regex.IsMatch(lines[index], "^(#{1,6})\\s+")
                && !Regex.IsMatch(lines[index], "^(-{3,}|\\*{3,}|_{3,})\\s*$")
                && !Regex.IsMatch(lines[index], "^>\\s?")
                && !Regex.IsMatch(lines[index], "^\\s*[-*+]\\s+")
                && !Regex.IsMatch(lines[index], "^\\s*\\d+\\.\\s+")
            )
                paragraph.Add(lines[index++]);
            html.Add($"<p>{Inline(string.Join(' ', paragraph))}</p>");
        }
        return string.Join('\n', html);
    }

    private static string CollectList(string[] lines, ref int index, bool ordered)
    {
        var items = new StringBuilder();
        var pattern = ordered ? "^\\s*\\d+\\.\\s+" : "^\\s*[-*+]\\s+";
        while (index < lines.Length && Regex.IsMatch(lines[index], pattern))
            items
                .Append("<li>")
                .Append(Inline(Regex.Replace(lines[index++], pattern, "")))
                .Append("</li>");
        return items.ToString();
    }

    private static string Inline(string text)
    {
        var value = Escape(text);
        var code = new List<string>();
        value = Regex.Replace(
            value,
            "`([^`]+)`",
            match =>
            {
                code.Add(match.Groups[1].Value);
                return $"\u0000CODE{code.Count - 1}\u0000";
            }
        );
        value = Regex.Replace(
            value,
            "\\[([^\\]]+)\\]\\(([^)\\s]+)\\)",
            match =>
                IsSafeUrl(match.Groups[2].Value)
                    ? $"<a href=\"{WebUtility.HtmlEncode(match.Groups[2].Value)}\" rel=\"noopener noreferrer\">{match.Groups[1].Value}</a>"
                    : match.Groups[1].Value
        );
        value = Regex.Replace(
            value,
            "\\*\\*([^*]+)\\*\\*|__([^_]+)__",
            match => $"<strong>{match.Groups[1].Value}{match.Groups[2].Value}</strong>"
        );
        value = Regex.Replace(
            value,
            "\\*([^*]+)\\*|_([^_]+)_",
            match => $"<em>{match.Groups[1].Value}{match.Groups[2].Value}</em>"
        );
        return Regex.Replace(
            value,
            "\u0000CODE(\\d+)\u0000",
            match => $"<code>{code[int.Parse(match.Groups[1].Value)]}</code>"
        );
    }

    private static bool IsSafeUrl(string url) =>
        url.StartsWith("https:", StringComparison.OrdinalIgnoreCase)
        || url.StartsWith("http:", StringComparison.OrdinalIgnoreCase)
        || url.StartsWith("mailto:", StringComparison.OrdinalIgnoreCase)
        || url.StartsWith('/')
        || url.StartsWith('#');

    private static string Escape(string value) => WebUtility.HtmlEncode(value);
}
