using System.Text.Json;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class KnowledgeMap
{
    private PublicKnowledgeGraph? Graph { get; set; }
    private string Title => L["knowledge_map"];
    private string Description => L["a_navigable_map_of_relationships_between_topics"];
    private string LoadingLabel => L["loading_map"];
    private string EmptyLabel => L["there_are_no_public_relationships_to_visualize"];
    private string VisualizationLabel => L["interactive_visualization"];
    private string TextFallbackLabel => L["text_version"];
    private string RelationsLabel => L["relations"];
    private string NoRelationsLabel => L["there_are_no_public_relationships_yet"];
    private string NodesLabel => L["nodes"];
    private string EdgesLabel => L["relations"];
    private string LegendLabel => L["knowledge_map_legend_label"];
    private string PanelEmptyLabel => L["knowledge_map_panel_empty_label"];
    private string PanelOpenLabel => L["knowledge_map_panel_open_label"];
    private string ResetViewLabel => L["knowledge_map_reset_view"];
    private string NoResultsLabel => L["knowledge_map_no_results"];
    private string ExpandViewLabel => L["knowledge_map_expand_view"];
    private string CollapseViewLabel => L["knowledge_map_collapse_view"];
    private string SeoTitle => PageField("knowledge-map", "title", Title);
    private string SeoDescription => PageField("knowledge-map", "description", Description);
    private string CanonicalPath => L["knowledge_map_path"];
    private string GraphJson =>
        JsonSerializer.Serialize(
            new
            {
                nodes = Graph?.Nodes.Select(node => new
                {
                    data = new
                    {
                        id = node.Id,
                        label = node.Label,
                        kind = node.Kind,
                        url = LocalizedUrl(node.Url),
                    },
                }),
                edges = Graph?.Edges.Select(edge => new
                {
                    data = new
                    {
                        id = $"{edge.Source}-{edge.Target}-{edge.RelationType}",
                        source = edge.Source,
                        target = edge.Target,
                        label = edge.Label,
                        relationType = edge.RelationType,
                    },
                }),
                kinds = Graph?.Kinds.ToDictionary(
                    pair => pair.Key,
                    pair => new { label = pair.Value.Label, color = pair.Value.Color }
                ),
            }
        );
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(CrumbLabel("topics", L["topics"]), LocalizedUrl("/topics"))];

    protected override async Task OnInitializedAsync()
    {
        await base.OnInitializedAsync();
        Graph = await GraphProvider.GetAsync(CurrentLocale);
    }

    private string PageField(string page, string field, string fallback)
    {
        if (
            Snapshot?.Pages.TryGetValue(page, out var fields) != true
            || fields.ValueKind != JsonValueKind.Object
            || !fields.TryGetProperty(field, out var value)
        )
            return fallback;
        return value.GetString() ?? fallback;
    }

    private static string LocalizedUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return "#";
        var path =
            url.StartsWith('/') ? url
            : Uri.TryCreate(url, UriKind.Absolute, out var absolute) ? absolute.AbsolutePath
            : "#";
        return LocalizedUrls.Current(path);
    }
}
