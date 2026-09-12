using Blog.Blazor.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Blog.Blazor.Database;

public sealed class BlogAdminDesignTimeFactory : IDesignTimeDbContextFactory<BlogAdminDbContext>
{
    public BlogAdminDbContext CreateDbContext(string[] args)
    {
        var connection =
            Environment.GetEnvironmentVariable("PORTFOLIO_DB_CONNECTION")
            ?? "Host=localhost;Database=portfolio;Username=portfolio;Password=portfolio";
        var options = new DbContextOptionsBuilder<BlogAdminDbContext>()
            .UseNpgsql(
                connection,
                npgsql =>
                    npgsql.MigrationsAssembly(
                        typeof(BlogAdminDesignTimeFactory).Assembly.GetName().Name
                    )
            )
            .Options;
        return new BlogAdminDbContext(options);
    }
}
