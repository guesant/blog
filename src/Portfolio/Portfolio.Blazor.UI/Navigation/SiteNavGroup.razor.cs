namespace Portfolio.Blazor.UI.Navigation;

public partial class SiteNavGroup
{
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary>Indents the items under the label with a tree rail, for hierarchical navs.</summary>
    [Parameter]
    public bool Nested { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
