using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.Database;

public sealed class PortfolioAdminDesignTimeFactory
    : IDesignTimeDbContextFactory<PortfolioAdminDbContext>
{
    public PortfolioAdminDbContext CreateDbContext(string[] args)
    {
        var path =
            Environment.GetEnvironmentVariable("PORTFOLIO_SQLITE_PATH")
            ?? "/data/db/portfolio.sqlite";
        var options = new DbContextOptionsBuilder<PortfolioAdminDbContext>()
            .UseSqlite(
                $"Data Source={path}",
                sqlite =>
                    sqlite.MigrationsAssembly(
                        typeof(PortfolioAdminDesignTimeFactory).Assembly.GetName().Name
                    )
            )
            .Options;
        return new PortfolioAdminDbContext(options);
    }
}
