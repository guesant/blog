using System.Text.Json;

namespace Blog.Blazor.Popularity;

public static class HackerNewsCollector
{
    public static async Task<CollectResult> CollectAsync(
        List<LinkRow> links,
        List<ResourceRow> resources
    )
    {
        var candidates = links
            .Where(link => IsHackerNewsUrl(link.Url))
            .GroupBy(link => link.ResourceId)
            .Select(group => group.FirstOrDefault(link => link.IsPrimary) ?? group.First())
            .ToList();

        using var client = new HttpClient();

        var values = new List<CollectedValue>();
        var unmatched = new List<string>();

        foreach (var link in candidates)
        {
            var itemId = ExtractItemId(link.Url);
            if (itemId is null)
            {
                unmatched.Add(
                    $"resource {link.ResourceId}: could not parse item id from {link.Url}"
                );
                continue;
            }

            try
            {
                using var response = await client.GetAsync(
                    $"https://hacker-news.firebaseio.com/v0/item/{itemId}.json"
                );
                if (!response.IsSuccessStatusCode)
                {
                    unmatched.Add(
                        $"resource {link.ResourceId}: HN API returned {(int)response.StatusCode}"
                    );
                    continue;
                }

                await using var stream = await response.Content.ReadAsStreamAsync();
                using var document = await JsonDocument.ParseAsync(stream);
                if (!document.RootElement.TryGetProperty("score", out var scoreElement))
                {
                    unmatched.Add($"resource {link.ResourceId}: HN item {itemId} has no score");
                    continue;
                }

                values.Add(new CollectedValue(link.ResourceId, scoreElement.GetInt64()));
            }
            catch (Exception exception) when (exception is HttpRequestException or JsonException)
            {
                unmatched.Add($"resource {link.ResourceId}: {exception.Message}");
            }

            await Task.Delay(350);
        }

        return new CollectResult(candidates.Count, values, unmatched);
    }

    private static bool IsHackerNewsUrl(string url) =>
        Uri.TryCreate(url, UriKind.Absolute, out var uri)
        && uri.Host.Equals("news.ycombinator.com", StringComparison.OrdinalIgnoreCase);

    private static string? ExtractItemId(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return null;
        }

        var trimmed = uri.Query.TrimStart('?');
        foreach (var pair in trimmed.Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var parts = pair.Split('=', 2);
            if (parts.Length == 2 && parts[0] == "id")
            {
                return Uri.UnescapeDataString(parts[1]);
            }
        }

        return null;
    }
}
