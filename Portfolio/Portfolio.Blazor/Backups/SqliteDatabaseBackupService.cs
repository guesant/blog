using Microsoft.Data.Sqlite;
using Portfolio.Blazor.Data.Providers;

namespace Portfolio.Blazor.Backups;

public sealed class SqliteDatabaseBackupService(
    DatabaseOptions options,
    ILogger<SqliteDatabaseBackupService> logger
) : IDatabaseBackupService
{
    public async Task<string> CreateBackupAsync(CancellationToken cancellationToken = default)
    {
        Directory.CreateDirectory(options.BackupRoot);
        var destinationPath = Path.Combine(
            options.BackupRoot,
            $"portfolio-{DateTime.UtcNow:yyyyMMddTHHmmssZ}.sqlite"
        );
        var temporaryPath = Path.Combine(
            options.BackupRoot,
            $".{Path.GetFileName(destinationPath)}.tmp"
        );

        try
        {
            var source = new SqliteConnection(
                new SqliteConnectionStringBuilder
                {
                    DataSource = options.SqlitePath,
                    Mode = SqliteOpenMode.ReadOnly,
                }.ToString()
            );
            var destination = new SqliteConnection(
                new SqliteConnectionStringBuilder
                {
                    DataSource = temporaryPath,
                    Mode = SqliteOpenMode.ReadWriteCreate,
                }.ToString()
            );
            await using (source.ConfigureAwait(false))
            await using (destination.ConfigureAwait(false))
            {
                await source.OpenAsync(cancellationToken);
                await destination.OpenAsync(cancellationToken);
                source.BackupDatabase(destination);
            }

            File.Move(temporaryPath, destinationPath);
        }
        catch
        {
            if (File.Exists(temporaryPath))
                File.Delete(temporaryPath);
            throw;
        }

        BackupPruning.Prune(options.BackupRoot, "portfolio-*.sqlite", options.BackupKeep, logger);
        return destinationPath;
    }
}
