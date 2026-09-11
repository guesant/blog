using System.Collections.Concurrent;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using Portfolio.Blazor.Core;
using Portfolio.Blazor.Core.Localization;

namespace Portfolio.Blazor.Client;

public sealed partial class BrowserPublicSiteContentProvider(
    HttpClient client,
    ILogger<BrowserPublicSiteContentProvider> logger
) : IPublicSiteContentProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly ConcurrentDictionary<string, Lazy<Task<PublicSiteSnapshot?>>> _snapshots = new(
        StringComparer.OrdinalIgnoreCase
    );

    public async Task<PublicSiteSnapshot?> GetAsync(
        string locale,
        CancellationToken cancellationToken = default
    )
    {
        locale = CultureCatalog.NormalizeName(locale);
        var entry = _snapshots.GetOrAdd(
            locale,
            value => new Lazy<Task<PublicSiteSnapshot?>>(
                () => LoadAsync(value, CancellationToken.None),
                LazyThreadSafetyMode.ExecutionAndPublication
            )
        );

        try
        {
            var snapshot = await entry.Value.WaitAsync(cancellationToken);
            if (snapshot is null)
                _snapshots.TryRemove(
                    new KeyValuePair<string, Lazy<Task<PublicSiteSnapshot?>>>(locale, entry)
                );
            return snapshot;
        }
        catch
        {
            if (entry.IsValueCreated && entry.Value.IsCompleted)
                _snapshots.TryRemove(
                    new KeyValuePair<string, Lazy<Task<PublicSiteSnapshot?>>>(locale, entry)
                );
            throw;
        }
    }

    public async Task<PublicProtectedEmailChallenge?> CreateEmailChallengeAsync(
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            using var response = await client.PostAsync(
                "api/protected-email/challenge",
                content: null,
                cancellationToken
            );
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

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

    private async Task<PublicSiteSnapshot?> LoadAsync(
        string locale,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var encodedLocale = Uri.EscapeDataString(locale);
            using var response = await client.GetAsync(
                $"_content/public-site?locale={encodedLocale}",
                cancellationToken
            );
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            return await response.Content.ReadFromJsonAsync<PublicSiteSnapshot>(
                JsonOptions,
                cancellationToken
            );
        }
        catch (Exception exception)
            when (exception is HttpRequestException or TaskCanceledException or JsonException)
        {
            LogContentProxyUnavailable(logger, exception);
            return null;
        }
    }

    [LoggerMessage(
        EventId = 2002,
        Level = LogLevel.Debug,
        Message = "Protected email challenge endpoint was unavailable."
    )]
    private static partial void LogEmailChallengeUnavailable(ILogger logger, Exception exception);

    [LoggerMessage(
        EventId = 2003,
        Level = LogLevel.Debug,
        Message = "Blazor content proxy was unavailable; using the local shell fallback."
    )]
    private static partial void LogContentProxyUnavailable(ILogger logger, Exception exception);
}
