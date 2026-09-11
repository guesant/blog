using System.Collections.Concurrent;
using System.Data.Common;
using System.Text.Json;
using Microsoft.Extensions.Localization;
using Portfolio.Blazor.Core;
using Portfolio.Blazor.Core.Localization;
using Portfolio.Blazor.Data.Providers;
using static Portfolio.Blazor.SqlReadHelpers;

namespace Portfolio.Blazor;

public sealed partial class PublicKnowledgeGraphProvider(
    IDatabaseProvider database,
    IConfiguration configuration,
    ILogger<PublicKnowledgeGraphProvider> logger,
    IStringLocalizer<SharedResource> localizer
) : IPublicKnowledgeGraphProvider
{
    private readonly SemaphoreSlim _graphGate = new(1, 1);
    private readonly ConcurrentDictionary<string, CachedGraph> _graphs = new(
        StringComparer.OrdinalIgnoreCase
    );
    private static readonly IReadOnlyDictionary<
        string,
        (string Table, string Translation, string Label, string ForeignKey)
    > NodeSources = new Dictionary<string, (string, string, string, string)>
    {
        ["topic"] = ("topics", "topic_translations", "name", "topic_id"),
        ["technology"] = ("technologies", "technology_translations", "name", "technology_id"),
        ["project"] = ("projects", "project_translations", "name", "project_id"),
        ["case-study"] = ("case_studies", "case_study_translations", "title", "case_study_id"),
        ["writing"] = ("writings", "writing_translations", "title", "writing_id"),
        ["finding"] = ("resources", "resource_translations", "title", "resource_id"),
        ["experiment"] = ("experiments", "experiment_translations", "name", "experiment_id"),
        ["snippet"] = ("snippets", "snippet_translations", "title", "snippet_id"),
        ["collection"] = (
            "reference_collections",
            "reference_collection_translations",
            "title",
            "reference_collection_id"
        ),
    };
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

                using var db = await database.OpenReadOnlyConnectionAsync(cancellationToken);
                var nodes = Nodes(db, locale);
                var index = nodes.ToDictionary(node => node.Id, StringComparer.Ordinal);
                var edges = new List<PublicGraphEdge>();
                AddTopicEdges(db, index, edges, locale);
                AddTechnologyEdges(db, index, edges, locale);
                AddCollectionEdges(db, index, edges, locale);
                AddRelationEdges(db, index, edges, locale);
                var kinds = nodes
                    .Select(node => node.Kind)
                    .Distinct()
                    .ToDictionary(
                        kind => kind,
                        kind => new PublicGraphKind(
                            Label(kind, locale),
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

    private static List<PublicGraphNode> Nodes(DbConnection db, string locale)
    {
        var nodes = new List<PublicGraphNode>();
        foreach (var source in NodeSources)
        {
            var visibility =
                source.Key is "topic" or "technology" ? ""
                : source.Key is "finding" ? " and x.hidden=false and x.visibility='public'"
                : source.Key is "project" or "case-study" ? " and x.hidden=false and x.nda=false"
                : " and x.hidden=false";
            var ordering =
                source.Key == "writing" ? "x.date_iso desc nulls last" : "x.\"order\" nulls first";
            var rows = Rows(
                db,
                $"select x.id, x.slug, x.public_id, t.{source.Value.Label} label from {source.Value.Table} x left join {source.Value.Translation} t on t.{source.Value.ForeignKey}=x.id and t.locale=@locale where 1=1{visibility} order by {ordering}",
                ("@locale", locale)
            );
            foreach (var row in rows)
            {
                var id = $"{source.Key}:{Text(row, "id")}";
                var label = Text(row, "label", Text(row, "slug"));
                nodes.Add(
                    new PublicGraphNode(
                        id,
                        source.Key,
                        label,
                        Url(
                            source.Key,
                            PublicRouteKey.Compose(Text(row, "public_id"), Text(row, "slug")),
                            locale
                        ),
                        JsonDocument
                            .Parse($"{{\"kind\":{JsonSerializer.Serialize(source.Key)}}}")
                            .RootElement.Clone()
                    )
                );
            }
        }
        return nodes;
    }

    private void AddTopicEdges(
        DbConnection db,
        IReadOnlyDictionary<string, PublicGraphNode> index,
        List<PublicGraphEdge> edges,
        string locale
    )
    {
        foreach (
            var row in Rows(
                db,
                "select topic_id, topicable_type, topicable_id, role from topicables order by id nulls first"
            )
        )
        {
            var sourceKind = Text(row, "topicable_type");
            var source = $"{sourceKind}:{Text(row, "topicable_id")}";
            var target = $"topic:{Text(row, "topic_id")}";
            var baseLabel = localizer["graph_has_topic"].Value;
            var role = Text(row, "role");
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
        DbConnection db,
        IReadOnlyDictionary<string, PublicGraphNode> index,
        List<PublicGraphEdge> edges,
        string locale
    )
    {
        foreach (
            var pivot in new[]
            {
                ("project_technology", "project", "project_id"),
                ("case_study_technology", "case-study", "case_study_id"),
                ("experiment_technology", "experiment", "experiment_id"),
            }
        )
        foreach (
            var row in Rows(
                db,
                $"select {pivot.Item3}, technology_id from {pivot.Item1} order by {pivot.Item3} nulls first, technology_id nulls first"
            )
        )
        {
            var source = $"{pivot.Item2}:{Text(row, pivot.Item3)}";
            var target = $"technology:{Text(row, "technology_id")}";
            if (index.ContainsKey(source) && index.ContainsKey(target))
                edges.Add(
                    new PublicGraphEdge(source, target, "uses", localizer["graph_uses"].Value)
                );
        }
    }

    private void AddCollectionEdges(
        DbConnection db,
        IReadOnlyDictionary<string, PublicGraphNode> index,
        List<PublicGraphEdge> edges,
        string locale
    )
    {
        foreach (
            var row in Rows(
                db,
                "select reference_collection_id, resource_id from reference_collection_item order by reference_collection_id nulls first, resource_id nulls first"
            )
        )
        {
            var source = $"collection:{Text(row, "reference_collection_id")}";
            var target = $"finding:{Text(row, "resource_id")}";
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
        DbConnection db,
        IReadOnlyDictionary<string, PublicGraphNode> index,
        List<PublicGraphEdge> edges,
        string locale
    )
    {
        foreach (
            var row in Rows(
                db,
                "select r.subject_type, r.subject_id, r.object_type, r.object_id, r.note, r.context, r.status, t.key, t.family, t.symmetric, t.outbound_label_en, t.outbound_label_pt_br, t.inbound_label_en, t.inbound_label_pt_br from content_relations r join relation_types t on t.id=r.relation_type_id where r.visibility is null or r.visibility='public' order by r.id nulls first"
            )
        )
        {
            var source = $"{Text(row, "subject_type")}:{Text(row, "subject_id")}";
            var target = $"{Text(row, "object_type")}:{Text(row, "object_id")}";
            if (index.ContainsKey(source) && index.ContainsKey(target))
                edges.Add(
                    new PublicGraphEdge(
                        source,
                        target,
                        Text(row, "key"),
                        TextForLocale(
                            row,
                            locale,
                            "outbound_label_en",
                            "outbound_label_pt_br",
                            Text(row, "key")
                        ),
                        Text(row, "family"),
                        Bool(row, "symmetric"),
                        TextForLocale(
                            row,
                            locale,
                            "inbound_label_en",
                            "inbound_label_pt_br",
                            Text(row, "key")
                        ),
                        Text(row, "note"),
                        Text(row, "context"),
                        Text(row, "status")
                    )
                );
        }
    }

    private string Label(string kind, string locale) =>
        localizer[$"graph_kind_{kind.Replace('-', '_')}"];

    private static string TextForLocale(
        Dictionary<string, object?> row,
        string locale,
        string englishColumn,
        string portugueseColumn,
        string fallback
    )
    {
        var column = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["en"] = englishColumn,
            ["pt-BR"] = portugueseColumn,
        }[CultureCatalog.NormalizeName(locale)];
        return Text(row, column, fallback);
    }

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
        Message = "Could not read the knowledge graph from SQLite in read-only mode."
    )]
    private static partial void LogKnowledgeGraphReadFailed(ILogger logger, Exception exception);
}
