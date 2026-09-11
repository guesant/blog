using System.Data.Common;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Npgsql;
using Portfolio.Blazor;
using Portfolio.Blazor.Core;
using Portfolio.Blazor.Data;
using Portfolio.Blazor.Data.Providers;
using Portfolio.Blazor.Data.Tests;

var sqlitePath = Path.Combine(
    Path.GetTempPath(),
    $"portfolio-data-tests-{Guid.NewGuid():n}.sqlite"
);
var postgresAdmin = Environment.GetEnvironmentVariable("PORTFOLIO_TEST_PG_CONNECTION");
string? postgresDatabase = null;
try
{
    var sqliteOptions = new DbContextOptionsBuilder<PortfolioAdminDbContext>()
        .UseSqlite(
            $"Data Source={sqlitePath}",
            sqlite => sqlite.MigrationsAssembly("Portfolio.Blazor.Database")
        )
        .Options;
    await using (var context = new PortfolioAdminDbContext(sqliteOptions))
    {
        await context.Database.MigrateAsync();
    }
    await using (var connection = new SqliteConnection($"Data Source={sqlitePath}"))
    {
        await connection.OpenAsync();
        Check(
            Version.Parse(Scalar(connection, "select sqlite_version()")) >= new Version(3, 30),
            "bundled SQLite must be 3.30 or newer for nulls last and boolean literals"
        );
        Seed.Apply(connection);
    }

    var sqliteResult = await Harvest(
        new Dictionary<string, string?>
        {
            ["PORTFOLIO_DB_PROVIDER"] = "sqlite",
            ["PORTFOLIO_SQLITE_PATH"] = sqlitePath,
        }
    );
    AssertContent(sqliteResult, "sqlite");
    Console.WriteLine("SQLite provider checks passed.");

    if (string.IsNullOrWhiteSpace(postgresAdmin))
    {
        Console.WriteLine(
            "PostgreSQL provider checks skipped: PORTFOLIO_TEST_PG_CONNECTION is not set."
        );
    }
    else
    {
        postgresDatabase = $"portfolio_test_{Guid.NewGuid():n}";
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
        var postgresOptions = new DbContextOptionsBuilder<PortfolioAdminDbContext>()
            .UseNpgsql(
                postgresConnection,
                npgsql => npgsql.MigrationsAssembly("Portfolio.Blazor.Database.Postgres")
            )
            .Options;
        await using (var context = new PortfolioAdminDbContext(postgresOptions))
        {
            await context.Database.MigrateAsync();
        }
        await using (var connection = new NpgsqlConnection(postgresConnection))
        {
            await connection.OpenAsync();
            Seed.Apply(connection);
        }

        var postgresResult = await Harvest(
            new Dictionary<string, string?>
            {
                ["PORTFOLIO_DB_PROVIDER"] = "postgres",
                ["PORTFOLIO_DB_CONNECTION"] = postgresConnection,
            }
        );
        AssertContent(postgresResult, "postgres");
        foreach (var (name, sqliteJson) in sqliteResult.Documents)
        {
            var postgresJson = postgresResult.Documents[name];
            if (sqliteJson != postgresJson)
            {
                throw new InvalidOperationException(
                    $"{name} differs between SQLite and PostgreSQL:\n{FirstDifference(sqliteJson, postgresJson)}"
                );
            }
        }
        Console.WriteLine("PostgreSQL provider checks passed and match SQLite byte for byte.");
    }
}
finally
{
    if (File.Exists(sqlitePath))
    {
        File.Delete(sqlitePath);
    }
    if (postgresDatabase is not null && !string.IsNullOrWhiteSpace(postgresAdmin))
    {
        await using var admin = new NpgsqlConnection(postgresAdmin);
        await admin.OpenAsync();
        await using var drop = admin.CreateCommand();
        drop.CommandText = $"drop database if exists {postgresDatabase} with (force)";
        await drop.ExecuteNonQueryAsync();
    }
}

Console.WriteLine("Portfolio.Blazor.Data checks passed.");
return 0;

static async Task<HarvestResult> Harvest(Dictionary<string, string?> settings)
{
    var configuration = new ConfigurationBuilder().AddInMemoryCollection(settings).Build();
    var services = new ServiceCollection();
    services.AddLogging(logging => logging.AddSimpleConsole().SetMinimumLevel(LogLevel.Warning));
    services.AddLocalization();
    services.AddSingleton<IConfiguration>(configuration);
    services.AddSingleton<ProtectedEmailChallengeService>();
    services.AddPortfolioDatabase(configuration);
    await using var provider = services.BuildServiceProvider();

    var site = provider.GetRequiredService<IPublicSiteContentProvider>();
    var graph = provider.GetRequiredService<IPublicKnowledgeGraphProvider>();
    var database = provider.GetRequiredService<IDatabaseProvider>();
    var factory = provider.GetRequiredService<IDbContextFactory<PortfolioAdminDbContext>>();

    var documents = new Dictionary<string, string>(StringComparer.Ordinal);
    var snapshots = new Dictionary<string, PublicSiteSnapshot>(StringComparer.Ordinal);
    foreach (var locale in new[] { "en", "pt-BR" })
    {
        var snapshot =
            await site.GetAsync(locale)
            ?? throw new InvalidOperationException($"snapshot for {locale} was null");
        snapshots[locale] = snapshot;
        documents[$"site-{locale}"] = Normalize(
            JsonSerializer.Serialize(snapshot, JsonSerializerOptions.Web)
        );
        var knowledge =
            await graph.GetAsync(locale)
            ?? throw new InvalidOperationException($"knowledge graph for {locale} was null");
        documents[$"graph-{locale}"] = Normalize(
            JsonSerializer.Serialize(knowledge, JsonSerializerOptions.Web)
        );
    }

    var before = await database.ReadFingerprintAsync();
    await using (var context = await factory.CreateDbContextAsync())
    {
        await context.SiteSettings.ExecuteUpdateAsync(setters =>
            setters.SetProperty(settings => settings.ShortName, "GB")
        );
        await database.SignalContentChangedAsync(context);
    }
    var after = await database.ReadFingerprintAsync();
    Check(
        before != after,
        $"{database.Kind}: the content fingerprint must change after a signalled write"
    );
    var refreshed =
        await site.GetAsync("en")
        ?? throw new InvalidOperationException("refreshed snapshot was null");
    Check(
        refreshed.Chrome.Site.ShortName == "GB",
        $"{database.Kind}: the public cache must refresh after a signalled write"
    );

    return new HarvestResult(documents, snapshots);
}

static void AssertContent(HarvestResult result, string engine)
{
    var en = result.Snapshots["en"];
    var slugs = string.Join(
        ' ',
        en.Projects.Select(project => project.Slug)
            .Concat(en.Cases.Select(item => item.Slug))
            .Concat(en.Writings.Select(item => item.Slug))
            .Concat(en.Findings.Select(item => item.Slug))
            .Concat(en.Collections.Select(item => item.Slug))
            .Concat(en.Experiments.Select(item => item.Slug))
            .Concat(en.Snippets.Select(item => item.Slug))
    );
    foreach (var leak in new[] { "hidden-", "nda-", "draft-" })
    {
        Check(
            !slugs.Contains(leak, StringComparison.Ordinal),
            $"{engine}: a {leak} item leaked into the public snapshot"
        );
    }
    Check(
        en.Projects.Count == 2,
        $"{engine}: expected the public and undated projects, got {en.Projects.Count}"
    );
    Check(
        en.Writings.Count == 3,
        $"{engine}: expected three public writings, got {en.Writings.Count}"
    );
    Check(
        en.Writings[0].Slug == "dated-post" && en.Writings[^1].Slug == "undated-post",
        $"{engine}: writings must sort newest first with the undated one last, got {string.Join(',', en.Writings.Select(item => item.Slug))}"
    );
    Check(
        en.Writings[0].Date == "2026-08-15",
        $"{engine}: writing date must be ISO yyyy-MM-dd, got '{en.Writings[0].Date}'"
    );
    var book = en.Findings.Single(item => item.Slug == "public-book");
    Check(
        book.PublishedDate == "2017-03-01",
        $"{engine}: finding published date must be ISO, got '{book.PublishedDate}'"
    );
    Check(
        book.Links is { Count: 2 } && book.Links.Any(link => link.IsFree),
        $"{engine}: finding links must round-trip with their boolean flags"
    );
    Check(
        book.AttributionTopics?.Count(topic => topic.Slug == "author-x") == 1,
        $"{engine}: the attribution topic must appear exactly once"
    );
    var collection = en.Collections.Single();
    Check(
        collection.Resources is { Count: 2 },
        $"{engine}: hidden resources must be dropped from collection items, got {collection.Resources?.Count}"
    );
    Check(
        en.Chrome.Site.ContactAvailable && en.Chrome.Site.ContactProfiles is { Count: 2 },
        $"{engine}: site settings booleans and contact profiles must round-trip"
    );
    Check(
        en.Projects[0].History is { Count: 2 },
        $"{engine}: project history must include both audit rows"
    );
    Check(
        result.Snapshots["pt-BR"].Projects[0].Name == "Projeto Publico",
        $"{engine}: pt-BR translations must win over the en fallback"
    );
}

static string Normalize(string json) =>
    Regex.Replace(json, "\"generated_at\":\"[^\"]*\"", "\"generated_at\":\"\"");

static string FirstDifference(string left, string right)
{
    var index = 0;
    while (index < left.Length && index < right.Length && left[index] == right[index])
    {
        index++;
    }
    var start = Math.Max(0, index - 120);
    return $"...{left[start..Math.Min(left.Length, index + 120)]}\n---\n...{right[start..Math.Min(right.Length, index + 120)]}";
}

static string Scalar(DbConnection connection, string sql)
{
    using var command = connection.CreateCommand();
    command.CommandText = sql;
    return Convert.ToString(command.ExecuteScalar()) ?? string.Empty;
}

static void Check(bool condition, string message)
{
    if (!condition)
    {
        throw new InvalidOperationException($"{message} (check failed)");
    }
}

internal sealed record HarvestResult(
    Dictionary<string, string> Documents,
    Dictionary<string, PublicSiteSnapshot> Snapshots
);
