namespace Portfolio.Blazor.Data.Providers;

public enum DatabaseProviderKind
{
    Sqlite,
    Postgres,
}

public sealed record DatabaseOptions(
    DatabaseProviderKind Provider,
    string SqlitePath,
    string? PostgresConnectionString,
    string? PostgresReadConnectionString,
    string BackupRoot,
    int BackupKeep,
    string BackupMode
)
{
    public static DatabaseOptions FromConfiguration(IConfiguration configuration)
    {
        var providerText = configuration["PORTFOLIO_DB_PROVIDER"] ?? "sqlite";
        var provider = providerText.Trim().ToLowerInvariant() switch
        {
            "sqlite" => DatabaseProviderKind.Sqlite,
            "postgres" or "postgresql" or "npgsql" => DatabaseProviderKind.Postgres,
            _ => throw new InvalidOperationException(
                $"PORTFOLIO_DB_PROVIDER must be 'sqlite' or 'postgres', got '{providerText}'."
            ),
        };
        var connection = configuration["PORTFOLIO_DB_CONNECTION"];
        if (provider == DatabaseProviderKind.Postgres && string.IsNullOrWhiteSpace(connection))
        {
            throw new InvalidOperationException(
                "PORTFOLIO_DB_CONNECTION is required when PORTFOLIO_DB_PROVIDER is 'postgres'."
            );
        }

        return new DatabaseOptions(
            provider,
            configuration["PORTFOLIO_SQLITE_PATH"] ?? "/data/portfolio.sqlite",
            connection,
            configuration["PORTFOLIO_DB_READ_CONNECTION"] ?? connection,
            configuration["PORTFOLIO_DB_BACKUP_ROOT"] ?? "/data/db-backups",
            int.TryParse(configuration["PORTFOLIO_DB_BACKUP_KEEP"], out var keep) ? keep : 20,
            (configuration["PORTFOLIO_DB_BACKUP_MODE"] ?? "none").Trim().ToLowerInvariant()
        );
    }
}
