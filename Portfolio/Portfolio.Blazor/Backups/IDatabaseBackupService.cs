namespace Portfolio.Blazor.Backups;

public interface IDatabaseBackupService
{
    Task<string> CreateBackupAsync(CancellationToken cancellationToken = default);
}
