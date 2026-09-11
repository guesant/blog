using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Portfolio.Blazor.Data;

public readonly record struct ContentFingerprint(long Version, long Count);

// IMPORTANT: the public readers invalidate their in-memory cache by comparing fingerprints, so
// this value only needs to change whenever committed content changes and to be cheap to read; it
// is not a general-purpose row count. SignalContentChangedAsync must run after every committed
// admin write, or an edit stays invisible on the public site until some other write bumps it.
public sealed class ContentRevisionTracker(IDbContextFactory<PortfolioPublicDbContext> contexts)
{
    public async Task<ContentFingerprint> ReadFingerprintAsync(
        CancellationToken cancellationToken = default
    )
    {
        await using var context = await contexts.CreateDbContextAsync(cancellationToken);
        var version = await context.ContentRevisions.MaxAsync(
            revision => (long?)revision.Version,
            cancellationToken
        );
        var count = await context.ContentRevisions.LongCountAsync(cancellationToken);
        return new ContentFingerprint(version ?? 0, count);
    }

    public Task SignalContentChangedAsync(
        PortfolioAdminDbContext dbContext,
        CancellationToken cancellationToken = default
    ) =>
        dbContext.Database.ExecuteSqlRawAsync(
            "insert into content_revisions (id, version, updated_at) values (1, 1, now()) on conflict (id) do update set version = content_revisions.version + 1, updated_at = now()",
            cancellationToken
        );

    public static bool IsReadFailure(Exception exception) =>
        exception is NpgsqlException or IOException or UnauthorizedAccessException;
}
