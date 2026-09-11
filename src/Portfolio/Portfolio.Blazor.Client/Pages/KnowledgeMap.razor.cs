using System.Text.Json;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class KnowledgeMap
{
    private PublicKnowledgeGraph? Graph { get; set; }
    private string Title => L["legacy_34a684f24942"];
    private string Description => L["legacy_0b5e5b9a5c97"];
    private string LoadingLabel => L["legacy_4766510b3100"];
    private string EmptyLabel => L["legacy_561b86366712"];
    private string VisualizationLabel => L["legacy_b071db3768f3"];
    private string TextFallbackLabel => L["legacy_fa4d8af51616"];
    private string RelationsLabel => L["legacy_34bb1362b84e"];
    private string NoRelationsLabel => L["legacy_1b8728f370cc"];
    private string NodesLabel => L["legacy_6d8a2f5c1bb2"];
    private string EdgesLabel => L["legacy_34bb1362b84e"];
    private string LegendLabel => L["knowledge_map_legend_label"];
    private string PanelEmptyLabel => L["knowledge_map_panel_empty_label"];
    private string PanelOpenLabel => L["knowledge_map_panel_open_label"];
    private string ResetViewLabel => L["knowledge_map_reset_view"];
    private string NoResultsLabel => L["knowledge_map_no_results"];
    private string ExpandViewLabel => L["knowledge_map_expand_view"];
    private string CollapseViewLabel => L["knowledge_map_collapse_view"];
    private string SeoTitle => PageField("knowledge-map", "title", Title);
    private string SeoDescription => PageField("knowledge-map", "description", Description);
    private string CanonicalPath => L["legacy_aee5ff166ae8"];
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
        [new(CrumbLabel("topics", L["legacy_4ab0be41630a"]), LocalizedUrl("/topics"))];

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
