using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Portfolio.Blazor.Data.Providers;

public sealed class PostgresDatabaseProvider(DatabaseOptions options) : IDatabaseProvider
{
    public DatabaseProviderKind Kind => DatabaseProviderKind.Postgres;

    public bool IsContentAvailable() =>
        !string.IsNullOrWhiteSpace(options.PostgresReadConnectionString);

    // IMPORTANT: the public site must never be able to write. SQLite gets that from the read-only
    // open mode; here every statement of the session runs inside a read-only transaction, whatever
    // grants the role happens to have. A SELECT-only role in PORTFOLIO_DB_READ_CONNECTION is the
    // second layer, not a replacement for this option.
    public async Task<DbConnection> OpenReadOnlyConnectionAsync(
        CancellationToken cancellationToken = default
    )
    {
        var connection = new NpgsqlConnection(
            new NpgsqlConnectionStringBuilder(options.PostgresReadConnectionString)
            {
                Options = "-c default_transaction_read_only=on",
            }.ToString()
        );
        await connection.OpenAsync(cancellationToken);
        return connection;
    }

    public void ConfigureAdmin(DbContextOptionsBuilder builder) =>
        builder.UseNpgsql(
            options.PostgresConnectionString,
            npgsql => npgsql.MigrationsAssembly("Portfolio.Blazor.Database.Postgres")
        );

    public async Task<ContentFingerprint> ReadFingerprintAsync(
        CancellationToken cancellationToken = default
    )
    {
        var connection = await OpenReadOnlyConnectionAsync(cancellationToken);
        await using (connection.ConfigureAwait(false))
        {
            var command = connection.CreateCommand();
            await using (command.ConfigureAwait(false))
            {
                command.CommandText =
                    "select coalesce(max(version), 0), coalesce(count(*), 0) from content_revisions";
                var reader = await command.ExecuteReaderAsync(cancellationToken);
                await using (reader.ConfigureAwait(false))
                {
                    return await reader.ReadAsync(cancellationToken)
                        ? new ContentFingerprint(reader.GetInt64(0), reader.GetInt64(1))
                        : new ContentFingerprint(0, 0);
                }
            }
        }
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
