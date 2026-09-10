namespace Portfolio.Blazor.Core;

public sealed class RobotsRule
{
    public string UserAgent { get; set; } = "*";
    public string Allow { get; set; } = string.Empty;
    public string Disallow { get; set; } = string.Empty;
    public string Delay { get; set; } = string.Empty;
}

public static class RobotsTxtGenerator
{
    public static string Build(IEnumerable<RobotsRule> rules, string? sitemap)
    {
        var lines = new List<string>();
        foreach (var rule in rules)
        {
            var allow = Lines(rule.Allow);
            var disallow = Lines(rule.Disallow);
            var delay = rule.Delay.Trim();
            if (allow.Count == 0 && disallow.Count == 0 && delay.Length == 0)
                continue;
            lines.Add(
                $"User-agent: {(string.IsNullOrWhiteSpace(rule.UserAgent) ? "*" : rule.UserAgent.Trim())}"
            );
            lines.AddRange(allow.Select(path => $"Allow: {path}"));
            lines.AddRange(disallow.Select(path => $"Disallow: {path}"));
            if (delay.Length > 0)
                lines.Add($"Crawl-delay: {delay}");
            lines.Add(string.Empty);
        }
        var url = sitemap?.Trim();
        if (url?.Length > 0)
            lines.Add($"Sitemap: {url}");
        return string.Join('\n', lines).Trim();
    }

    private static IReadOnlyList<string> Lines(string value) =>
        value.Split('\n').Select(line => line.Trim()).Where(line => line.Length > 0).ToArray();
}
