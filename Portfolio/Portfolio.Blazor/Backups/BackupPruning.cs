namespace Portfolio.Blazor.Backups;

internal static partial class BackupPruning
{
    internal static void Prune(string root, string pattern, int keep, ILogger logger)
    {
        var backups = Directory
            .GetFiles(root, pattern)
            .OrderBy(path => path, StringComparer.Ordinal)
            .ToArray();

        foreach (var stale in backups.Take(Math.Max(0, backups.Length - keep)))
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
