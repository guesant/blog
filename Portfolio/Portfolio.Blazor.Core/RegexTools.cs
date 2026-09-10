using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace Portfolio.Blazor.Core;

public sealed record RegexMatch(string Value, IReadOnlyList<string?> Groups, int Number);

public sealed record RegexTestResult(
    bool IsValid,
    string HighlightHtml,
    IReadOnlyList<RegexMatch> Matches
)
{
    public static RegexTestResult Empty(string text) => new(true, WebUtility.HtmlEncode(text), []);

    public static RegexTestResult Invalid(string text) =>
        new(false, WebUtility.HtmlEncode(text), []);
}

public static class RegexTesterEngine
{
    public static RegexTestResult Test(
        string? pattern,
        string? text,
        bool ignoreCase,
        bool multiline,
        bool singleline
    )
    {
        var source = text ?? string.Empty;
        if (string.IsNullOrEmpty(pattern))
            return RegexTestResult.Empty(source);
        try
        {
            var options =
                RegexOptions.CultureInvariant
                | (ignoreCase ? RegexOptions.IgnoreCase : 0)
                | (multiline ? RegexOptions.Multiline : 0)
                | (singleline ? RegexOptions.Singleline : 0);
            var regex = new Regex(pattern, options);
            var matches = regex
                .Matches(source)
                .Cast<Match>()
                .Select(
                    (match, index) =>
                        new RegexMatch(
                            match.Value,
                            match
                                .Groups.Cast<Group>()
                                .Skip(1)
                                .Select(group => group.Success ? group.Value : null)
                                .ToArray(),
                            index + 1
                        )
                )
                .ToArray();
            var html = new StringBuilder();
            var last = 0;
            foreach (var match in regex.Matches(source).Cast<Match>())
            {
                html.Append(WebUtility.HtmlEncode(source[last..match.Index]));
                html.Append("<mark>").Append(WebUtility.HtmlEncode(match.Value)).Append("</mark>");
                last = match.Index + match.Length;
            }
            html.Append(WebUtility.HtmlEncode(source[last..]));
            return new(true, html.ToString().Length == 0 ? "&nbsp;" : html.ToString(), matches);
        }
        catch (ArgumentException)
        {
            return RegexTestResult.Invalid(source);
        }
    }
}
