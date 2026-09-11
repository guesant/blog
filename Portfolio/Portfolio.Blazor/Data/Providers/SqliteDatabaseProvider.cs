using System.Data.Common;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.Blazor.Data.Providers;

public sealed class SqliteDatabaseProvider(DatabaseOptions options) : IDatabaseProvider
{
    public DatabaseProviderKind Kind => DatabaseProviderKind.Sqlite;

    public bool IsContentAvailable() => File.Exists(options.SqlitePath);

    public async Task<DbConnection> OpenReadOnlyConnectionAsync(
        CancellationToken cancellationToken = default
    )
    {
        var connection = new SqliteConnection(
            new SqliteConnectionStringBuilder
            {
                DataSource = options.SqlitePath,
                Mode = SqliteOpenMode.ReadOnly,
                Cache = SqliteCacheMode.Shared,
            }.ToString()
        );
        await connection.OpenAsync(cancellationToken);
        return connection;
    }

    public void ConfigureAdmin(DbContextOptionsBuilder builder)
    {
        var connectionString = new SqliteConnectionStringBuilder
        {
            DataSource = options.SqlitePath,
            Mode = SqliteOpenMode.ReadWrite,
            ForeignKeys = true,
        }.ToString();
        builder.UseSqlite(
            connectionString,
            sqlite => sqlite.MigrationsAssembly("Portfolio.Blazor.Database")
        );
        builder.AddInterceptors(new PortfolioAdminConnectionInterceptor());
    }

    public Task<ContentFingerprint> ReadFingerprintAsync(
        CancellationToken cancellationToken = default
    )
    {
        var file = new FileInfo(options.SqlitePath);
        return Task.FromResult(new ContentFingerprint(file.Length, file.LastWriteTimeUtc.Ticks));
    }

    // IMPORTANT: call this after every committed write. The public readers invalidate their
    // cache by the main .sqlite file's length/mtime, but WAL writes land in the -wal sidecar
    // first; without an explicit checkpoint an edit can stay invisible on the public site until
    // SQLite's own 1000-page auto-checkpoint fires.
    public Task SignalContentChangedAsync(
        PortfolioAdminDbContext dbContext,
        CancellationToken cancellationToken = default
    ) =>
        dbContext.Database.ExecuteSqlRawAsync(
            "PRAGMA wal_checkpoint(TRUNCATE);",
            cancellationToken
        );

    public bool IsReadFailure(Exception exception) =>
        exception is SqliteException or IOException or UnauthorizedAccessException;
}
