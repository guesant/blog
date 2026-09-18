using System.Collections.Concurrent;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using Blog.Blazor.Core;
using Blog.Blazor.Core.Localization;

namespace Blog.Blazor;

public sealed partial class LaravelPublicSiteContentProvider(
    IHttpClientFactory clients,
    ILogger<LaravelPublicSiteContentProvider> logger
) : IPublicSiteContentProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly ConcurrentDictionary<string, CachedSnapshot> _snapshots = new(
        StringComparer.OrdinalIgnoreCase
    );

    public async Task<PublicSiteSnapshot?> GetAsync(
        string locale,
        CancellationToken cancellationToken = default
    )
    {
        locale = CultureCatalog.NormalizeName(locale);
        if (
            _snapshots.TryGetValue(locale, out var cached)
            && cached.ExpiresAt > DateTimeOffset.UtcNow
        )
            return cached.Snapshot;

        var snapshot = await LoadAsync(locale, cancellationToken);
        if (snapshot is not null)
            _snapshots[locale] = new CachedSnapshot(snapshot, DateTimeOffset.UtcNow.AddMinutes(1));
        return snapshot;
    }

    public async Task<PublicProtectedEmailChallenge?> CreateEmailChallengeAsync(
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            using var response = await Client.PostAsync(
                "protected-email/challenge",
                content: null,
                cancellationToken
            );
            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content.ReadFromJsonAsync<PublicProtectedEmailChallenge>(
                JsonOptions,
                cancellationToken
            );
        }
        catch (Exception exception)
            when (exception is HttpRequestException or TaskCanceledException or JsonException)
        {
            LogEmailChallengeUnavailable(logger, exception);
            return null;
        }
    }

    private HttpClient Client => clients.CreateClient("laravel-content");

    private sealed record CachedSnapshot(PublicSiteSnapshot Snapshot, DateTimeOffset ExpiresAt);

    private async Task<PublicSiteSnapshot?> LoadAsync(
        string locale,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var encodedLocale = Uri.EscapeDataString(locale);
            using var response = await Client.GetAsync(
                $"public-site?locale={encodedLocale}",
                cancellationToken
            );
            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content.ReadFromJsonAsync<PublicSiteSnapshot>(
                JsonOptions,
                cancellationToken
            );
        }
        catch (Exception exception)
            when (exception is HttpRequestException or TaskCanceledException or JsonException)
        {
            LogContentApiUnavailable(logger, exception);
            return null;
        }
    }

    [LoggerMessage(
        EventId = 2101,
        Level = LogLevel.Debug,
        Message = "Laravel protected email challenge endpoint was unavailable."
    )]
    private static partial void LogEmailChallengeUnavailable(ILogger logger, Exception exception);

    [LoggerMessage(
        EventId = 2102,
        Level = LogLevel.Debug,
        Message = "Laravel public content API was unavailable."
    )]
    private static partial void LogContentApiUnavailable(ILogger logger, Exception exception);
}
