namespace Portfolio.Blazor.Core;

// IMPORTANT: public detail URLs are "{publicId}-{slug}" so the slug can change without breaking
// links: the 6-char hex public id is what identifies the item, the slug is decoration. Plain legacy
// slugs keep resolving, which is why Matches tries the slug first and the id prefix last.
public static class PublicRouteKey
{
    public static string Compose(string? publicId, string slug) =>
        string.IsNullOrWhiteSpace(publicId) ? slug : $"{publicId}-{slug}";

    public static string? PublicIdOf(string? key) =>
        key is { Length: >= 7 } && key[6] == '-' && key.Take(6).All(Uri.IsHexDigit)
            ? key[..6].ToLowerInvariant()
            : null;

    public static string LastSegment(string url) =>
        url.Split('?', 2)[0]
            .TrimEnd('/')
            .Split('/', StringSplitOptions.RemoveEmptyEntries)
            .LastOrDefault()
        ?? string.Empty;

    public static bool Matches(string? itemUrl, string itemSlug, string requested)
    {
        if (itemSlug.Equals(requested, StringComparison.OrdinalIgnoreCase))
            return true;
        if (string.IsNullOrEmpty(itemUrl))
            return false;

        var segment = LastSegment(itemUrl);
        if (segment.Equals(requested, StringComparison.OrdinalIgnoreCase))
            return true;

        var requestedId = PublicIdOf(requested);
        return requestedId is not null && requestedId == PublicIdOf(segment);
    }
}
