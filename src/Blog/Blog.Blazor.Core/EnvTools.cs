using System.Text.RegularExpressions;

namespace Blog.Blazor.Core;

public sealed record EnvIssue(int Line, string Kind, string? Key);

public sealed record EnvEntry(string Key, string Value);

public sealed record EnvValidationResult(
    IReadOnlyList<EnvIssue> Issues,
    IReadOnlyList<EnvEntry> Entries
);

public static partial class EnvFileValidationEngine
{
    public static EnvValidationResult Validate(string? content)
    {
        var issues = new List<EnvIssue>();
        var entries = new List<EnvEntry>();
        var seen = new HashSet<string>(StringComparer.Ordinal);
        var lines = (content ?? string.Empty).Split('\n');
        for (var index = 0; index < lines.Length; index++)
        {
            var line = lines[index].Trim();
            if (line.Length == 0 || line.StartsWith('#'))
                continue;
            var match = AssignmentPattern().Match(line);
            if (!match.Success)
            {
                issues.Add(new(index + 1, "malformed", null));
                continue;
            }
            var key = match.Groups[1].Value;
            var value = match.Groups[2].Value;
            if (!KeyPattern().IsMatch(key))
            {
                issues.Add(new(index + 1, "invalid-key", key));
                continue;
            }
            if (!seen.Add(key))
            {
                issues.Add(new(index + 1, "duplicate", key));
                continue;
            }
            entries.Add(new(key, value));
        }
        return new(issues, entries);
    }

    [GeneratedRegex("^([^=\\s]+)=(.*)$")]
    private static partial Regex AssignmentPattern();

    [GeneratedRegex("^[A-Za-z_][A-Za-z0-9_]*$")]
    private static partial Regex KeyPattern();
}
