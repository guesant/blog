using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Blog.Blazor.Popularity;

public static partial class GithubCollector
{
    public static async Task<CollectResult> CollectAsync(
        List<LinkRow> links,
        List<ResourceRow> resources
    )
    {
        var candidates = links
            .Where(link =>
                string.Equals(link.Platform, "github", StringComparison.OrdinalIgnoreCase)
            )
            .GroupBy(link => link.ResourceId)
            .Select(group => group.FirstOrDefault(link => link.IsPrimary) ?? group.First())
            .ToList();

        var token = Environment.GetEnvironmentVariable("GITHUB_TOKEN");
        using var client = new HttpClient();
        client.DefaultRequestHeaders.UserAgent.Add(
            new ProductInfoHeaderValue("portfolio-popularity-refresh", "1.0")
        );
        if (!string.IsNullOrWhiteSpace(token))
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                token
            );
        }

        var values = new List<CollectedValue>();
        var unmatched = new List<string>();

        foreach (var link in candidates)
        {
            var repo = ParseOwnerRepo(link.Url);
            if (repo is null)
            {
                unmatched.Add(
                    $"resource {link.ResourceId}: could not parse owner/repo from {link.Url}"
                );
                continue;
            }

            try
            {
                using var response = await client.GetAsync(
                    $"https://api.github.com/repos/{repo.Value.Owner}/{repo.Value.Repo}"
                );
                if (!response.IsSuccessStatusCode)
                {
                    unmatched.Add(
                        $"resource {link.ResourceId}: GitHub API returned {(int)response.StatusCode} for {repo.Value.Owner}/{repo.Value.Repo}"
                    );
                    continue;
                }

                await using var stream = await response.Content.ReadAsStreamAsync();
                using var document = await JsonDocument.ParseAsync(stream);
                var stars = document.RootElement.GetProperty("stargazers_count").GetInt64();
                values.Add(new CollectedValue(link.ResourceId, stars));
            }
            catch (Exception exception) when (exception is HttpRequestException or JsonException)
            {
                unmatched.Add($"resource {link.ResourceId}: {exception.Message}");
            }

            await Task.Delay(350);
        }

        return new CollectResult(candidates.Count, values, unmatched);
    }

    private static (string Owner, string Repo)? ParseOwnerRepo(string url)
    {
        var match = OwnerRepoRegex().Match(url);
        if (!match.Success)
        {
            return null;
        }

        return (match.Groups["owner"].Value, match.Groups["repo"].Value);
    }

    [GeneratedRegex(@"github\.com/(?<owner>[^/\s]+)/(?<repo>[^/\s#?]+)", RegexOptions.IgnoreCase)]
    private static partial Regex OwnerRepoRegex();
}
