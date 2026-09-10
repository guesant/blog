using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class ContentRelations
{
    [Parameter, EditorRequired]
    public string CurrentUrl { get; set; } = string.Empty;

    [Parameter]
    public string? Heading { get; set; }

    private IReadOnlyList<RelationView> Relations { get; set; } = [];

    protected override async Task OnParametersSetAsync()
    {
        var graph = await GraphProvider.GetAsync(
            Cultures.Normalize(System.Globalization.CultureInfo.CurrentUICulture.Name).Name
        );
        if (graph is null)
        {
            Relations = [];
            return;
        }

        var currentPath = new Uri(CurrentUrl, UriKind.RelativeOrAbsolute).IsAbsoluteUri
            ? new Uri(CurrentUrl, UriKind.RelativeOrAbsolute).AbsolutePath
            : CurrentUrl;
        var node = graph.Nodes.FirstOrDefault(item =>
            string.Equals(item.Url, currentPath, StringComparison.OrdinalIgnoreCase)
        );
        if (node is null)
        {
            Relations = [];
            return;
        }

        var linked = graph
            .Edges.Where(edge => edge.Source == node.Id || edge.Target == node.Id)
            .Where(edge => edge.RelationType is not ("has-topic" or "uses" or "contains"))
            .Select(edge =>
            {
                var linkedId = edge.Source == node.Id ? edge.Target : edge.Source;
                var linkedNode = graph.Nodes.FirstOrDefault(item => item.Id == linkedId);
                var relationLabel =
                    edge.Source == node.Id || edge.Symmetric
                        ? edge.Label
                        : edge.InboundLabel ?? edge.Label;
                return linkedNode is null || string.IsNullOrWhiteSpace(linkedNode.Url)
                    ? null
                    : new RelationView(
                        linkedNode.Url!,
                        linkedNode.Label,
                        relationLabel,
                        edge.Note,
                        edge.Context,
                        edge.Status
                    );
            })
            .Where(item => item is not null)
            .Cast<RelationView>()
            .GroupBy(item => item.Url, StringComparer.OrdinalIgnoreCase)
            .Select(group => group.First())
            .Take(20)
            .ToArray();
        Relations = linked;
    }

    private sealed record RelationView(
        string Url,
        string Label,
        string RelationLabel,
        string? Note,
        string? Context,
        string? Status
    );
}
