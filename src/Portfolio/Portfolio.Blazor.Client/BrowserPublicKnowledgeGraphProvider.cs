using System.Net.Http.Json;
using System.Text.Json;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client;

public sealed partial class BrowserPublicKnowledgeGraphProvider(
    HttpClient client,
    ILogger<BrowserPublicKnowledgeGraphProvider> logger
) : IPublicKnowledgeGraphProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<PublicKnowledgeGraph?> GetAsync(
        string locale,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var encodedLocale = Uri.EscapeDataString(locale);
            using var response = await client.GetAsync(
                $"_content/public-knowledge-map?locale={encodedLocale}",
                cancellationToken
            );
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            return await response.Content.ReadFromJsonAsync<PublicKnowledgeGraph>(
                JsonOptions,
                cancellationToken
            );
        }
        catch (Exception exception)
            when (exception is HttpRequestException or TaskCanceledException or JsonException)
        {
            LogKnowledgeGraphProxyUnavailable(logger, exception);
            return null;
        }
    }

    [LoggerMessage(
        EventId = 2001,
        Level = LogLevel.Debug,
        Message = "Blazor knowledge map proxy was unavailable."
    )]
    private static partial void LogKnowledgeGraphProxyUnavailable(
        ILogger logger,
        Exception exception
    );
}
