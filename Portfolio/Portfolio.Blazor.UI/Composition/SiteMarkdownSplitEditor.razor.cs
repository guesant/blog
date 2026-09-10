namespace Portfolio.Blazor.UI.Composition;

public partial class SiteMarkdownSplitEditor
{
    [Parameter, EditorRequired]
    public string Id { get; set; } = string.Empty;

    [Parameter]
    public string Value { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public EventCallback<string> ValueChanged { get; set; }

    [Parameter]
    public int Rows { get; set; } = 12;

    [Parameter, EditorRequired]
    public Func<string?, string> Render { get; set; } = default!;

    [Parameter]
    public string EditorLabel { get; set; } = "Editor";

    [Parameter]
    public string PreviewLabel { get; set; } = "Preview";
}
