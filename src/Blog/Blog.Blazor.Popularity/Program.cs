using Blog.Blazor.Data;
using Blog.Blazor.Popularity;
using Microsoft.EntityFrameworkCore;

var options = CliOptions.Parse(args);
if (options is null)
{
    return 1;
}

var connectionString =
    Environment.GetEnvironmentVariable("PORTFOLIO_DB_CONNECTION")
    ?? "Host=localhost;Database=portfolio;Username=portfolio;Password=portfolio";

var dbContextOptions = new DbContextOptionsBuilder<BlogAdminDbContext>()
    .UseNpgsql(connectionString)
    .Options;

await using var dbContext = new BlogAdminDbContext(dbContextOptions);

var links = await dbContext
    .ResourceLinks.AsNoTracking()
    .Select(link => new LinkRow(link.ResourceId, link.Url, link.Platform, link.IsPrimary))
    .ToListAsync();

var resources = await dbContext
    .Resources.AsNoTracking()
    .Select(resource => new ResourceRow(
        resource.Id,
        resource.Slug,
        resource.PopularityValue,
        resource.PopularityKind
    ))
    .ToListAsync();

CollectResult collected = options.Kind switch
{
    PopularityKind.Github => await GithubCollector.CollectAsync(links, resources),
    PopularityKind.Youtube => YoutubeCollector.Collect(links, resources, options.InputPath!),
    PopularityKind.Hn => await HackerNewsCollector.CollectAsync(links, resources),
    _ => throw new InvalidOperationException("Unknown kind."),
};

Console.WriteLine(
    $"kind={options.Kind.ToKindLabel()} candidates={collected.CandidateCount} "
        + $"matched={collected.Values.Count} unmatched={collected.UnmatchedCount}"
);

foreach (var unmatched in collected.UnmatchedDetails)
{
    Console.WriteLine($"  unmatched: {unmatched}");
}

if (collected.Values.Count == 0)
{
    Console.WriteLine("Nothing to update.");
    return 0;
}

var ranked = PopularityRanker.Rank(collected.Values);

if (options.DryRun)
{
    Console.WriteLine("id\tslug\told_value\tnew_value\tnew_rank");
    foreach (var item in ranked)
    {
        var resource = resources.First(r => r.Id == item.ResourceId);
        Console.WriteLine(
            $"{resource.Id}\t{resource.Slug}\t{resource.PopularityValue?.ToString() ?? "-"}\t{item.Value}\t{item.Rank:0.####}"
        );
    }

    Console.WriteLine("Dry run: no rows written.");
    return 0;
}

await using var transaction = await dbContext.Database.BeginTransactionAsync();

var kindLabel = options.Kind.ToKindLabel();
foreach (var item in ranked)
{
    await dbContext
        .Resources.Where(resource => resource.Id == item.ResourceId)
        .ExecuteUpdateAsync(setters =>
            setters
                .SetProperty(resource => resource.PopularityValue, item.Value)
                .SetProperty(resource => resource.PopularityKind, kindLabel)
                .SetProperty(resource => resource.PopularityRank, item.Rank)
                .SetProperty(resource => resource.PopularityRefreshedAt, DateTime.UtcNow)
        );
}

await ContentRevisionWriter.SignalContentChangedAsync(dbContext);

await transaction.CommitAsync();

Console.WriteLine($"Updated {ranked.Count} resources.");
return 0;
