using Blog.Blazor.Data;
using Blog.Blazor.Data.Tests;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var postgresAdmin = Environment.GetEnvironmentVariable("PORTFOLIO_TEST_PG_CONNECTION");
if (string.IsNullOrWhiteSpace(postgresAdmin))
{
    Console.Error.WriteLine(
        "PORTFOLIO_TEST_PG_CONNECTION is required to run the data harness against PostgreSQL."
    );
    return 1;
}

var postgresDatabase = $"portfolio_test_{Guid.NewGuid():n}";
try
{
    await using (var admin = new NpgsqlConnection(postgresAdmin))
    {
        await admin.OpenAsync();
        await using var create = admin.CreateCommand();
        create.CommandText = $"create database {postgresDatabase}";
        await create.ExecuteNonQueryAsync();
    }

    var postgresConnection = new NpgsqlConnectionStringBuilder(postgresAdmin)
    {
        Database = postgresDatabase,
    }.ToString();
    var options = new DbContextOptionsBuilder<BlogAdminDbContext>()
        .UseNpgsql(postgresConnection, npgsql => npgsql.MigrationsAssembly("Blog.Blazor.Database"))
        .Options;

    await using (var context = new BlogAdminDbContext(options))
    {
        await context.Database.MigrateAsync();
    }

    await using (var connection = new NpgsqlConnection(postgresConnection))
    {
        await connection.OpenAsync();
        Seed.Apply(connection);
    }

    await using (var context = new BlogAdminDbContext(options))
    {
        Check(await context.Projects.CountAsync() >= 4, "the seed must contain project records");
        Check(await context.Resources.AnyAsync(), "the seed must contain resource records");
        _ = await context.ContentRevisions.CountAsync();
    }

    Console.WriteLine("PostgreSQL schema and seed checks passed.");
}
finally
{
    await using var admin = new NpgsqlConnection(postgresAdmin);
    await admin.OpenAsync();
    await using var drop = admin.CreateCommand();
    drop.CommandText = $"drop database if exists {postgresDatabase} with (force)";
    await drop.ExecuteNonQueryAsync();
}

Console.WriteLine("Blog.Blazor.Data checks passed.");
return 0;

static void Check(bool condition, string message)
{
    if (!condition)
        throw new InvalidOperationException($"{message} (check failed)");
}
