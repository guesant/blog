using Microsoft.EntityFrameworkCore;
using Npgsql;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Data;

public static class DatabaseServiceCollectionExtensions
{
    public static IServiceCollection AddPortfolioDatabase(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        var connectionString = configuration["PORTFOLIO_DB_CONNECTION"];
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("PORTFOLIO_DB_CONNECTION is required.");
        }
        var readConnectionString =
            configuration["PORTFOLIO_DB_READ_CONNECTION"] ?? connectionString;

        services.AddDbContextFactory<PortfolioAdminDbContext>(builder =>
            builder.UseNpgsql(
                connectionString,
                npgsql => npgsql.MigrationsAssembly("Portfolio.Blazor.Database")
            )
        );

        // IMPORTANT: the public site must never be able to write. Every statement of the session
        // runs inside a read-only transaction, whatever grants the role happens to have. A
        // SELECT-only role in PORTFOLIO_DB_READ_CONNECTION is the second layer, not a replacement
        // for this option.
        services.AddDbContextFactory<PortfolioPublicDbContext>(builder =>
            builder.UseNpgsql(
                new NpgsqlConnectionStringBuilder(readConnectionString)
                {
                    Options = "-c default_transaction_read_only=on",
                }.ToString()
            )
        );

        services.AddSingleton<ContentRevisionTracker>();
        services.AddSingleton<IPublicSiteContentProvider, PublicSiteContentProvider>();
        services.AddSingleton<IPublicKnowledgeGraphProvider, PublicKnowledgeGraphProvider>();
        return services;
    }
}
