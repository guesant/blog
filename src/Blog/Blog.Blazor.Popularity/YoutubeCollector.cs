using System.Text.Json;

namespace Blog.Blazor.Popularity;

public static class YoutubeCollector
{
    public static CollectResult Collect(
        List<LinkRow> links,
        List<ResourceRow> resources,
        string inputPath
    )
    {
        var candidates = links
            .Where(link =>
                string.Equals(link.Platform, "youtube", StringComparison.OrdinalIgnoreCase)
            )
            .GroupBy(link => link.ResourceId)
            .Select(group => group.FirstOrDefault(link => link.IsPrimary) ?? group.First())
            .ToList();

        var json = File.ReadAllText(inputPath);
        var viewsByUrl = JsonSerializer.Deserialize<Dictionary<string, long>>(json) ?? [];
        var viewsByVideoId = viewsByUrl.ToDictionary(
            pair => ExtractVideoId(pair.Key) ?? pair.Key,
            pair => pair.Value
        );

        var values = new List<CollectedValue>();
        var matchedVideoIds = new HashSet<string>();
        var unmatched = new List<string>();

        foreach (var link in candidates)
        {
            var videoId = ExtractVideoId(link.Url);
            if (videoId is null || !viewsByVideoId.TryGetValue(videoId, out var views))
            {
                unmatched.Add($"resource {link.ResourceId}: no view count for {link.Url}");
                continue;
            }

            values.Add(new CollectedValue(link.ResourceId, views));
            matchedVideoIds.Add(videoId);
        }

        foreach (var (url, _) in viewsByUrl)
        {
            var videoId = ExtractVideoId(url);
            if (videoId is null || !matchedVideoIds.Contains(videoId))
            {
                unmatched.Add($"input entry unmatched by any resource_links row: {url}");
            }
        }

        return new CollectResult(candidates.Count, values, unmatched);
    }

    private static string? ExtractVideoId(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return null;
        }

        var host = uri.Host.Replace("www.", "").Replace("m.", "");

        if (host.Equals("youtu.be", StringComparison.OrdinalIgnoreCase))
        {
            return uri.AbsolutePath.Trim('/');
        }

        if (!host.Equals("youtube.com", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        return ParseQueryParameter(uri.Query, "v");
    }

    private static string? ParseQueryParameter(string query, string name)
    {
        var trimmed = query.TrimStart('?');
        foreach (var pair in trimmed.Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var parts = pair.Split('=', 2);
            if (parts.Length == 2 && parts[0] == name)
            {
                return Uri.UnescapeDataString(parts[1]);
            }
        }

        return null;
    }
}
