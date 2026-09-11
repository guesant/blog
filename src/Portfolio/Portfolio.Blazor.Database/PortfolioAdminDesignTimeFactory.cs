using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.Database;

public sealed class PortfolioAdminDesignTimeFactory
    : IDesignTimeDbContextFactory<PortfolioAdminDbContext>
{
    public PortfolioAdminDbContext CreateDbContext(string[] args)
    {
        var connection =
            Environment.GetEnvironmentVariable("PORTFOLIO_DB_CONNECTION")
            ?? "Host=localhost;Database=portfolio;Username=portfolio;Password=portfolio";
        var options = new DbContextOptionsBuilder<PortfolioAdminDbContext>()
            .UseNpgsql(
                connection,
                npgsql =>
                    npgsql.MigrationsAssembly(
                        typeof(PortfolioAdminDesignTimeFactory).Assembly.GetName().Name
                    )
            )
            .Options;
        return new PortfolioAdminDbContext(options);
    }
}
