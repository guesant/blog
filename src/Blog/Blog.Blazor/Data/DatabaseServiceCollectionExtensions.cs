using Blog.Blazor.Core;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Blog.Blazor.Data;

public static class DatabaseServiceCollectionExtensions
{
    public static IServiceCollection AddBlogDatabase(
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

        services.AddDbContextFactory<BlogAdminDbContext>(builder =>
            builder.UseNpgsql(
                connectionString,
                npgsql => npgsql.MigrationsAssembly("Blog.Blazor.Database")
            )
        );

        // IMPORTANT: the public site must never be able to write. Every statement of the session
        // runs inside a read-only transaction, whatever grants the role happens to have. A
        // SELECT-only role in PORTFOLIO_DB_READ_CONNECTION is the second layer, not a replacement
        // for this option.
        services.AddDbContextFactory<BlogPublicDbContext>(builder =>
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
