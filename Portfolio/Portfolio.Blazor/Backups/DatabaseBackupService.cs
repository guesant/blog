using Microsoft.Data.Sqlite;

namespace Portfolio.Blazor.Backups;

public sealed partial class DatabaseBackupService(
    IConfiguration configuration,
    ILogger<DatabaseBackupService> logger
) : IDatabaseBackupService
{
    private readonly string _sourcePath =
        configuration["PORTFOLIO_SQLITE_PATH"] ?? "/data/portfolio.sqlite";
    private readonly string _backupRoot =
        configuration["PORTFOLIO_DB_BACKUP_ROOT"] ?? "/data/db-backups";
    private readonly int _keep = int.TryParse(
        configuration["PORTFOLIO_DB_BACKUP_KEEP"],
        out var keep
    )
        ? keep
        : 20;

    public async Task<string> CreateBackupAsync(CancellationToken cancellationToken = default)
    {
        Directory.CreateDirectory(_backupRoot);
        var destinationPath = Path.Combine(
            _backupRoot,
            $"portfolio-{DateTime.UtcNow:yyyyMMddTHHmmssZ}.sqlite"
        );
        var temporaryPath = Path.Combine(_backupRoot, $".{Path.GetFileName(destinationPath)}.tmp");

        try
        {
            var source = new SqliteConnection(
                new SqliteConnectionStringBuilder
                {
                    DataSource = _sourcePath,
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

        PruneOldBackups();
        return destinationPath;
    }

    private void PruneOldBackups()
    {
        var backups = Directory
            .GetFiles(_backupRoot, "portfolio-*.sqlite")
            .OrderBy(path => path, StringComparer.Ordinal)
            .ToArray();

        foreach (var stale in backups.Take(Math.Max(0, backups.Length - _keep)))
        {
            try
            {
                File.Delete(stale);
            }
            catch (IOException exception)
            {
                LogBackupPruneFailed(logger, exception, stale);
            }
        }
    }

    [LoggerMessage(
        EventId = 2001,
        Level = LogLevel.Warning,
        Message = "Failed to prune stale database backup {Path}."
    )]
    private static partial void LogBackupPruneFailed(
        ILogger logger,
        Exception exception,
        string path
    );
}
