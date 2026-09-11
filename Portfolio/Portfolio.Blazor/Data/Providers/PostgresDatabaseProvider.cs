using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Portfolio.Blazor.Data.Providers;

public sealed class PostgresDatabaseProvider(DatabaseOptions options) : IDatabaseProvider
{
    public DatabaseProviderKind Kind => DatabaseProviderKind.Postgres;

    public bool IsContentAvailable() =>
        !string.IsNullOrWhiteSpace(options.PostgresReadConnectionString);

    public void ConfigureAdmin(DbContextOptionsBuilder builder) =>
        builder.UseNpgsql(
            options.PostgresConnectionString,
            npgsql => npgsql.MigrationsAssembly("Portfolio.Blazor.Database.Postgres")
        );

    // IMPORTANT: the public site must never be able to write. SQLite gets that from the read-only
    // open mode; here every statement of the session runs inside a read-only transaction, whatever
    // grants the role happens to have. A SELECT-only role in PORTFOLIO_DB_READ_CONNECTION is the
    // second layer, not a replacement for this option.
    public void ConfigurePublicRead(DbContextOptionsBuilder builder) =>
        builder.UseNpgsql(
            new NpgsqlConnectionStringBuilder(options.PostgresReadConnectionString)
            {
                Options = "-c default_transaction_read_only=on",
            }.ToString()
        );

    public async Task<ContentFingerprint> ReadFingerprintAsync(
        CancellationToken cancellationToken = default
    )
    {
        var context = new PortfolioPublicDbContext(ReadOptions());
        await using (context.ConfigureAwait(false))
        {
            var version = await context.ContentRevisions.MaxAsync(
                revision => (long?)revision.Version,
                cancellationToken
            );
            var count = await context.ContentRevisions.LongCountAsync(cancellationToken);
            return new ContentFingerprint(version ?? 0, count);
        }
    }

    private DbContextOptions<PortfolioPublicDbContext> ReadOptions()
    {
        var builder = new DbContextOptionsBuilder<PortfolioPublicDbContext>();
        ConfigurePublicRead(builder);
        return builder.Options;
    }

    public Task SignalContentChangedAsync(
        PortfolioAdminDbContext dbContext,
        CancellationToken cancellationToken = default
    ) =>
        dbContext.Database.ExecuteSqlRawAsync(
            "insert into content_revisions (id, version, updated_at) values (1, 1, now()) on conflict (id) do update set version = content_revisions.version + 1, updated_at = now()",
            cancellationToken
        );

    public bool IsReadFailure(Exception exception) =>
        exception is NpgsqlException or IOException or UnauthorizedAccessException;
}
