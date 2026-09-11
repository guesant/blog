using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Portfolio.Blazor.Core;
using Portfolio.Blazor.Core.Localization;
using Portfolio.Blazor.Data;
using Portfolio.Blazor.Data.Providers;
using Portfolio.Blazor.PublicQueries;

namespace Portfolio.Blazor;

public sealed partial class PublicKnowledgeGraphProvider(
    IDatabaseProvider database,
    IDbContextFactory<PortfolioPublicDbContext> contexts,
    ILogger<PublicKnowledgeGraphProvider> logger,
    IStringLocalizer<SharedResource> localizer
) : IPublicKnowledgeGraphProvider
{
    private readonly SemaphoreSlim _graphGate = new(1, 1);
    private readonly ConcurrentDictionary<string, CachedGraph> _graphs = new(
        StringComparer.OrdinalIgnoreCase
    );
    private static readonly IReadOnlyDictionary<string, string> Colors = new Dictionary<
        string,
        string
    >
    {
        ["topic"] = "#1d4ed8",
        ["finding"] = "#1a1a1a",
        ["technology"] = "#0f766e",
        ["writing"] = "#b45309",
        ["case-study"] = "#7c3aed",
        ["project"] = "#0369a1",
        ["experiment"] = "#be123c",
        ["snippet"] = "#4d7c0f",
        ["collection"] = "#a16207",
    };

    public async Task<PublicKnowledgeGraph?> GetAsync(
        string locale,
        CancellationToken cancellationToken = default
    )
    {
        cancellationToken.ThrowIfCancellationRequested();
        locale = CultureCatalog.NormalizeName(locale);
        try
        {
            if (!database.IsContentAvailable())
                return null;
            var fingerprint = await database.ReadFingerprintAsync(cancellationToken);
            if (_graphs.TryGetValue(locale, out var cached) && cached.Fingerprint == fingerprint)
                return cached.Graph;

            await _graphGate.WaitAsync(cancellationToken);
            try
            {
                fingerprint = await database.ReadFingerprintAsync(cancellationToken);
                if (_graphs.TryGetValue(locale, out cached) && cached.Fingerprint == fingerprint)
                    return cached.Graph;

                await using var db = await contexts.CreateDbContextAsync(cancellationToken);
                var nodes = Nodes(db, locale);
                var index = nodes.ToDictionary(node => node.Id, StringComparer.Ordinal);
                var edges = new List<PublicGraphEdge>();
                AddTopicEdges(db, index, edges);
                AddTechnologyEdges(db, index, edges);
                AddCollectionEdges(db, index, edges);
                AddRelationEdges(db, index, edges, locale);
                var kinds = nodes
                    .Select(node => node.Kind)
                    .Distinct()
                    .ToDictionary(
                        kind => kind,
                        kind => new PublicGraphKind(
                            Label(kind),
                            Colors.TryGetValue(kind, out var color) ? color : "#6b6b6b"
                        )
                    );
                var graph = new PublicKnowledgeGraph(nodes, edges, kinds);
                _graphs[locale] = new CachedGraph(fingerprint, graph);
                return graph;
            }
            finally
            {
                _graphGate.Release();
            }
        }
        catch (Exception exception) when (database.IsReadFailure(exception))
        {
            LogKnowledgeGraphReadFailed(logger, exception);
            return null;
        }
    }

    private sealed record CachedGraph(ContentFingerprint Fingerprint, PublicKnowledgeGraph Graph);

    private static List<PublicGraphNode> Nodes(PortfolioPublicDbContext db, string locale)
    {
        var nodes = new List<PublicGraphNode>();
        foreach (var (kind, rows) in GraphQueries.Nodes(db, locale))
        {
            foreach (var row in rows)
            {
                nodes.Add(
                    new PublicGraphNode(
                        $"{kind}:{Format.Id(row.Id)}",
                        kind,
                        row.Label ?? row.Slug,
                        Url(kind, PublicRouteKey.Compose(row.PublicId, row.Slug), locale),
                        JsonDocument
                            .Parse($"{{\"kind\":{JsonSerializer.Serialize(kind)}}}")
                            .RootElement.Clone()
                    )
                );
            }
        }
        return nodes;
    }

    private void AddTopicEdges(
        PortfolioPublicDbContext db,
        IReadOnlyDictionary<string, PublicGraphNode> index,
        List<PublicGraphEdge> edges
    )
    {
        foreach (var row in GraphQueries.TopicEdges(db))
        {
            var source = $"{row.TopicableType}:{Format.Id(row.TopicableId)}";
            var target = $"topic:{Format.Id(row.TopicId)}";
            var baseLabel = localizer["graph_has_topic"].Value;
            var role = Format.Text(row.Role);
            var label =
                !string.IsNullOrWhiteSpace(role)
                && !role.Equals("primary", StringComparison.OrdinalIgnoreCase)
                    ? $"{baseLabel} ({role})"
                    : baseLabel;
            if (index.ContainsKey(source) && index.ContainsKey(target))
                edges.Add(new PublicGraphEdge(source, target, "has-topic", label));
        }
    }

    private void AddTechnologyEdges(
        PortfolioPublicDbContext db,
        IReadOnlyDictionary<string, PublicGraphNode> index,
        List<PublicGraphEdge> edges
    )
    {
        foreach (var (kind, rows) in GraphQueries.TechnologyEdges(db))
        {
            foreach (var row in rows)
            {
                var source = $"{kind}:{Format.Id(row.OwnerId)}";
                var target = $"technology:{Format.Id(row.TechnologyId)}";
                if (index.ContainsKey(source) && index.ContainsKey(target))
                    edges.Add(
                        new PublicGraphEdge(source, target, "uses", localizer["graph_uses"].Value)
                    );
            }
        }
    }

    private void AddCollectionEdges(
        PortfolioPublicDbContext db,
        IReadOnlyDictionary<string, PublicGraphNode> index,
        List<PublicGraphEdge> edges
    )
    {
        foreach (var row in GraphQueries.CollectionEdges(db))
        {
            var source = $"collection:{Format.Id(row.CollectionId)}";
            var target = $"finding:{Format.Id(row.ResourceId)}";
            if (index.ContainsKey(source) && index.ContainsKey(target))
                edges.Add(
                    new PublicGraphEdge(
                        source,
                        target,
                        "contains",
                        localizer["graph_contains"].Value
                    )
                );
        }
    }

    private static void AddRelationEdges(
        PortfolioPublicDbContext db,
        IReadOnlyDictionary<string, PublicGraphNode> index,
        List<PublicGraphEdge> edges,
        string locale
    )
    {
        var portuguese = CultureCatalog.NormalizeName(locale) == "pt-BR";
        foreach (var row in GraphQueries.RelationEdges(db))
        {
            var source = $"{row.SubjectType}:{Format.Id(row.SubjectId)}";
            var target = $"{row.ObjectType}:{Format.Id(row.ObjectId)}";
            if (index.ContainsKey(source) && index.ContainsKey(target))
                edges.Add(
                    new PublicGraphEdge(
                        source,
                        target,
                        row.Key,
                        portuguese ? row.OutboundLabelPtBr : row.OutboundLabelEn,
                        row.Family,
                        row.Symmetric,
                        portuguese ? row.InboundLabelPtBr : row.InboundLabelEn,
                        Format.Text(row.Note),
                        Format.Text(row.Context),
                        Format.Text(row.Status)
                    )
                );
        }
    }

    private string Label(string kind) => localizer[$"graph_kind_{kind.Replace('-', '_')}"];

    private static string? Url(string kind, string slug, string locale)
    {
        var prefix = CultureCatalog.UrlPrefix(locale);
        return kind switch
        {
            "project" => $"{prefix}/projects/{slug}",
            "case-study" => $"{prefix}/cases/{slug}",
            "writing" => $"{prefix}/writing/{slug}",
            "finding" => $"{prefix}/findings/{slug}",
            "collection" => $"{prefix}/collections/{slug}",
            "topic" => $"{prefix}/topics/{slug}",
            "technology" => $"{prefix}/technologies/{slug}",
            "snippet" => $"{prefix}/snippets/{slug}",
            "experiment" => $"{prefix}/projects/experiments/{slug}",
            _ => null,
        };
    }

    [LoggerMessage(
        EventId = 1002,
        Level = LogLevel.Error,
        Message = "Could not read the knowledge graph in read-only mode."
    )]
    private static partial void LogKnowledgeGraphReadFailed(ILogger logger, Exception exception);
}
