using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text.Json;
using Blog.Blazor.Core;
using Blog.Blazor.Core.Localization;

namespace Blog.Blazor;

public sealed record PublicSiteSnapshotPayload(byte[] Body, string ETag);

public sealed class PublicSiteSnapshotPayloadCache(IPublicSiteContentProvider contentProvider)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly ConcurrentDictionary<string, CachedPayload> _payloads = new(
        StringComparer.OrdinalIgnoreCase
    );

    public async Task<PublicSiteSnapshotPayload?> GetAsync(
        string locale,
        CancellationToken cancellationToken = default
    )
    {
        locale = CultureCatalog.NormalizeName(locale);
        var snapshot = await contentProvider.GetAsync(locale, cancellationToken);
        if (snapshot is null)
            return null;

        if (
            _payloads.TryGetValue(locale, out var cached)
            && ReferenceEquals(cached.Snapshot, snapshot)
        )
            return cached.Payload;

        var body = JsonSerializer.SerializeToUtf8Bytes(snapshot, JsonOptions);
        var etag = $"\"{Convert.ToHexStringLower(SHA256.HashData(body))[..32]}\"";
        var payload = new PublicSiteSnapshotPayload(body, etag);
        _payloads[locale] = new CachedPayload(snapshot, payload);
        return payload;
    }

    private sealed record CachedPayload(
        PublicSiteSnapshot Snapshot,
        PublicSiteSnapshotPayload Payload
    );
}
