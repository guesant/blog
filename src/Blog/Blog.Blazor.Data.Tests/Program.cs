using System.Text.Json;
using System.Text.RegularExpressions;
using Blog.Blazor;
using Blog.Blazor.Core;
using Blog.Blazor.Data;
using Blog.Blazor.Data.Tests;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
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

    var result = await Harvest(
        new Dictionary<string, string?> { ["PORTFOLIO_DB_CONNECTION"] = postgresConnection }
    );
    AssertContent(result);
    Console.WriteLine("PostgreSQL provider checks passed.");
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

static async Task<HarvestResult> Harvest(Dictionary<string, string?> settings)
{
    var configuration = new ConfigurationBuilder().AddInMemoryCollection(settings).Build();
    var services = new ServiceCollection();
    services.AddLogging(logging => logging.AddSimpleConsole().SetMinimumLevel(LogLevel.Warning));
    services.AddLocalization();
    services.AddSingleton<IConfiguration>(configuration);
    services.AddSingleton<ProtectedEmailChallengeService>();
    services.AddBlogDatabase(configuration);
    await using var provider = services.BuildServiceProvider();

    var site = provider.GetRequiredService<IPublicSiteContentProvider>();
    var graph = provider.GetRequiredService<IPublicKnowledgeGraphProvider>();
    var revisions = provider.GetRequiredService<ContentRevisionTracker>();
    var factory = provider.GetRequiredService<IDbContextFactory<BlogAdminDbContext>>();

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

    var publicFactory = provider.GetRequiredService<IDbContextFactory<BlogPublicDbContext>>();
    await using (var publicContext = await publicFactory.CreateDbContextAsync())
    {
        AssertPublicModel(publicContext);
    }

    var before = await revisions.ReadFingerprintAsync();
    await using (var context = await factory.CreateDbContextAsync())
    {
        await context.SiteSettings.ExecuteUpdateAsync(setters =>
            setters.SetProperty(settings => settings.ShortName, "GB")
        );
        await revisions.SignalContentChangedAsync(context);
    }
    var after = await revisions.ReadFingerprintAsync();
    Check(before != after, "the content fingerprint must change after a signalled write");
    var refreshed =
        await site.GetAsync("en")
        ?? throw new InvalidOperationException("refreshed snapshot was null");
    Check(
        refreshed.Chrome.Site.ShortName == "GB",
        "the public cache must refresh after a signalled write"
    );

    return new HarvestResult(documents, snapshots);
}

static void AssertPublicModel(BlogPublicDbContext context)
{
    foreach (var entityType in context.Model.GetEntityTypes())
    {
        var filtered =
            entityType.FindProperty("Hidden") is not null
            || entityType.ClrType == typeof(Blog.Blazor.Data.Entities.CreditEntry);
        Check(
            !filtered || entityType.GetDeclaredQueryFilters().Count > 0,
            $"{entityType.ClrType.Name} must carry a public visibility filter"
        );
    }
    Check(
        context.ChangeTracker.QueryTrackingBehavior == QueryTrackingBehavior.NoTracking,
        "the public context must be no-tracking"
    );
    Check(context.Projects.Count() == 2, "the project filter must hide hidden and nda rows");
    Check(context.Projects.IgnoreQueryFilters().Count() == 4, "the seed must hold four projects");
    Check(
        !context.Resources.Any(resource =>
            resource.Slug.StartsWith("hidden-") || resource.Slug.StartsWith("draft-")
        ),
        "the resource filter must hide hidden and draft rows"
    );
    Check(
        !context.CaseStudies.Any(caseStudy => caseStudy.Slug.StartsWith("nda-")),
        "the case study filter must hide nda rows"
    );
    Check(
        context.CreditEntries.All(credit => credit.Active),
        "the credit filter must hide inactive rows"
    );
    var threw = false;
    try
    {
        context.SaveChanges();
    }
    catch (InvalidOperationException)
    {
        threw = true;
    }
    Check(threw, "the public context must refuse SaveChanges");
}

static void AssertContent(HarvestResult result)
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
            $"a {leak} item leaked into the public snapshot"
        );
    }
    Check(
        en.Projects.Count == 2,
        $"expected the public and undated projects, got {en.Projects.Count}"
    );
    Check(en.Writings.Count == 3, $"expected three public writings, got {en.Writings.Count}");
    Check(
        en.Writings[0].Slug == "dated-post" && en.Writings[^1].Slug == "undated-post",
        $"writings must sort newest first with the undated one last, got {string.Join(',', en.Writings.Select(item => item.Slug))}"
    );
    Check(
        en.Writings[0].Date == "2026-08-15",
        $"writing date must be ISO yyyy-MM-dd, got '{en.Writings[0].Date}'"
    );
    var book = en.Findings.Single(item => item.Slug == "public-book");
    Check(
        book.PublishedDate == "2017-03-01",
        $"finding published date must be ISO, got '{book.PublishedDate}'"
    );
    Check(
        book.Links is { Count: 2 } && book.Links.Any(link => link.IsFree),
        "finding links must round-trip with their boolean flags"
    );
    Check(
        book.AttributionTopics?.Count(topic => topic.Slug == "author-x") == 1,
        "the attribution topic must appear exactly once"
    );
    var collection = en.Collections.Single();
    Check(
        collection.Resources is { Count: 2 },
        $"hidden resources must be dropped from collection items, got {collection.Resources?.Count}"
    );
    Check(
        en.Chrome.Site.ContactAvailable && en.Chrome.Site.ContactProfiles is { Count: 2 },
        "site settings booleans and contact profiles must round-trip"
    );
    Check(
        en.Chrome.Profile is { BirthCity: "Town", Interests: "systems", Learning: "rust" }
            && en.Chrome.Profile.PersonalInterests is { ValueKind: JsonValueKind.Array },
        "profile personal fields must reach the snapshot"
    );
    Check(en.Projects[0].History is { Count: 2 }, "project history must include both audit rows");
    Check(
        result.Snapshots["pt-BR"].Projects[0].Name == "Projeto Publico",
        "pt-BR translations must win over the en fallback"
    );
}

static string Normalize(string json) =>
    Regex.Replace(json, "\"generated_at\":\"[^\"]*\"", "\"generated_at\":\"\"");

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
