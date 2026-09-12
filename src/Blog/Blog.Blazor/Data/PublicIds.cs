using System.Security.Cryptography;

namespace Blog.Blazor.Data;

public static class PublicIds
{
    // IMPORTANT: 6 lowercase hex chars, the same shape the AddPublicIds migration backfills with
    // lower(hex(randomblob(3))); PublicRouteKey.PublicIdOf relies on exactly this length/alphabet
    // to tell a "{publicId}-{slug}" route key apart from a plain legacy slug.
    public static string New() =>
        Convert.ToHexString(RandomNumberGenerator.GetBytes(3)).ToLowerInvariant();
}
