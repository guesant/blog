using System.Diagnostics;
using Npgsql;
using Portfolio.Blazor.Data.Providers;

namespace Portfolio.Blazor.Backups;

public sealed partial class PostgresDatabaseBackupService(
    DatabaseOptions options,
    ILogger<PostgresDatabaseBackupService> logger
) : IDatabaseBackupService
{
    private int _delegatedLogged;

    public async Task<string> CreateBackupAsync(CancellationToken cancellationToken = default)
    {
        if (options.BackupMode != "pg_dump")
        {
            if (Interlocked.Exchange(ref _delegatedLogged, 1) == 0)
            {
                LogBackupDelegated(logger);
            }
            return string.Empty;
        }

        Directory.CreateDirectory(options.BackupRoot);
        var destinationPath = Path.Combine(
            options.BackupRoot,
            $"portfolio-{DateTime.UtcNow:yyyyMMddTHHmmssZ}.pgdump"
        );
        var builder = new NpgsqlConnectionStringBuilder(options.PostgresConnectionString);
        var start = new ProcessStartInfo("pg_dump")
        {
            RedirectStandardError = true,
            UseShellExecute = false,
        };
        start.ArgumentList.Add("--format=custom");
        start.ArgumentList.Add($"--file={destinationPath}");
        start.ArgumentList.Add($"--host={builder.Host}");
        start.ArgumentList.Add($"--port={builder.Port}");
        start.ArgumentList.Add($"--username={builder.Username}");
        start.ArgumentList.Add(builder.Database ?? "portfolio");
        if (!string.IsNullOrEmpty(builder.Password))
        {
            start.Environment["PGPASSWORD"] = builder.Password;
        }

        using var process =
            Process.Start(start)
            ?? throw new InvalidOperationException("pg_dump could not be started.");
        var errors = await process.StandardError.ReadToEndAsync(cancellationToken);
        await process.WaitForExitAsync(cancellationToken);
        if (process.ExitCode != 0)
        {
            if (File.Exists(destinationPath))
            {
                File.Delete(destinationPath);
            }
            throw new InvalidOperationException($"pg_dump failed ({process.ExitCode}): {errors}");
        }

        BackupPruning.Prune(options.BackupRoot, "portfolio-*.pgdump", options.BackupKeep, logger);
        return destinationPath;
    }

    [LoggerMessage(
        EventId = 2101,
        Level = LogLevel.Information,
        Message = "Database backups are delegated to the PostgreSQL host (PORTFOLIO_DB_BACKUP_MODE=none)."
    )]
    private static partial void LogBackupDelegated(ILogger logger);
}
