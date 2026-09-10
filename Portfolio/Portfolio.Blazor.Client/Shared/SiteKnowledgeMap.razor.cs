namespace Portfolio.Blazor.Client.Shared;

public partial class SiteKnowledgeMap
{
    [Parameter, EditorRequired]
    public string GraphJson { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string HeadingId { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string Description { get; set; } = string.Empty;

    [Parameter]
    public string ElementId { get; set; } = "knowledge-map-cytoscape";

    [Parameter]
    public string DescriptionId { get; set; } = "knowledge-map-description";

    [Parameter]
    public string DataId { get; set; } = "knowledge-map-data";

    [Parameter]
    public string RootId { get; set; } = "knowledge-map-root";

    [Parameter]
    public string LegendLabel { get; set; } = "node types";

    [Parameter]
    public string PanelEmptyLabel { get; set; } = "select a node to see its connections.";

    [Parameter]
    public string PanelOpenLabel { get; set; } = "open";

    [Parameter]
    public string ResetViewLabel { get; set; } = "reset view";

    [Parameter]
    public string NoResultsLabel { get; set; } = "no nodes match this filter.";

    [Parameter]
    public string ExpandViewLabel { get; set; } = "expand view";

    [Parameter]
    public string CollapseViewLabel { get; set; } = "close";
}
