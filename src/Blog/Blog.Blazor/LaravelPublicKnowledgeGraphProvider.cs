using System.Collections.Concurrent;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using Blog.Blazor.Core;
using Blog.Blazor.Core.Localization;

namespace Blog.Blazor;

public sealed partial class LaravelPublicKnowledgeGraphProvider(
    IHttpClientFactory clients,
    ILogger<LaravelPublicKnowledgeGraphProvider> logger
) : IPublicKnowledgeGraphProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly ConcurrentDictionary<string, CachedGraph> _graphs = new(
        StringComparer.OrdinalIgnoreCase
    );

    public async Task<PublicKnowledgeGraph?> GetAsync(
        string locale,
        CancellationToken cancellationToken = default
    )
    {
        locale = CultureCatalog.NormalizeName(locale);
        if (_graphs.TryGetValue(locale, out var cached) && cached.ExpiresAt > DateTimeOffset.UtcNow)
            return cached.Graph;

        var graph = await LoadAsync(locale, cancellationToken);
        if (graph is not null)
            _graphs[locale] = new CachedGraph(graph, DateTimeOffset.UtcNow.AddMinutes(1));
        return graph;
    }

    private HttpClient Client => clients.CreateClient("laravel-content");

    private sealed record CachedGraph(PublicKnowledgeGraph Graph, DateTimeOffset ExpiresAt);

    private async Task<PublicKnowledgeGraph?> LoadAsync(
        string locale,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var encodedLocale = Uri.EscapeDataString(locale);
            using var response = await Client.GetAsync(
                $"public/knowledge-map?locale={encodedLocale}",
                cancellationToken
            );
            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content.ReadFromJsonAsync<PublicKnowledgeGraph>(
                JsonOptions,
                cancellationToken
            );
        }
        catch (Exception exception)
            when (exception is HttpRequestException or TaskCanceledException or JsonException)
        {
            LogKnowledgeGraphUnavailable(logger, exception);
            return null;
        }
    }

    [LoggerMessage(
        EventId = 2103,
        Level = LogLevel.Debug,
        Message = "Laravel public knowledge graph API was unavailable."
    )]
    private static partial void LogKnowledgeGraphUnavailable(ILogger logger, Exception exception);
}
