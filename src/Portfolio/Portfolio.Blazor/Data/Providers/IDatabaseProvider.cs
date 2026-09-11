using Microsoft.EntityFrameworkCore;

namespace Portfolio.Blazor.Data.Providers;

public readonly record struct ContentFingerprint(long Primary, long Secondary);

public interface IDatabaseProvider
{
    DatabaseProviderKind Kind { get; }

    bool IsContentAvailable();

    void ConfigureAdmin(DbContextOptionsBuilder builder);

    void ConfigurePublicRead(DbContextOptionsBuilder builder);

    Task<ContentFingerprint> ReadFingerprintAsync(CancellationToken cancellationToken = default);

    Task SignalContentChangedAsync(
        PortfolioAdminDbContext dbContext,
        CancellationToken cancellationToken = default
    );

    bool IsReadFailure(Exception exception);
}
