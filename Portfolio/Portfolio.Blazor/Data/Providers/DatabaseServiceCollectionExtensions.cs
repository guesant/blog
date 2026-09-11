using Microsoft.EntityFrameworkCore;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Data.Providers;

public static class DatabaseServiceCollectionExtensions
{
    public static IServiceCollection AddPortfolioDatabase(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        var options = DatabaseOptions.FromConfiguration(configuration);
        services.AddSingleton(options);
        if (options.Provider == DatabaseProviderKind.Postgres)
        {
            services.AddSingleton<IDatabaseProvider, PostgresDatabaseProvider>();
        }
        else
        {
            services.AddSingleton<IDatabaseProvider, SqliteDatabaseProvider>();
        }

        services.AddDbContextFactory<PortfolioAdminDbContext>(
            (provider, builder) =>
                provider.GetRequiredService<IDatabaseProvider>().ConfigureAdmin(builder)
        );
        services.AddSingleton<IPublicSiteContentProvider, PublicSiteContentProvider>();
        services.AddSingleton<IPublicKnowledgeGraphProvider, PublicKnowledgeGraphProvider>();
        return services;
    }
}
