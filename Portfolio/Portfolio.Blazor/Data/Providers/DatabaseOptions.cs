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
    string? PostgresReadConnectionString
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
            configuration["PORTFOLIO_DB_READ_CONNECTION"] ?? connection
        );
    }
}
