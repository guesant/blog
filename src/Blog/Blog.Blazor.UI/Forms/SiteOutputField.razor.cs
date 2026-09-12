namespace Blog.Blazor.UI.Forms;

public partial class SiteOutputField
{
    [Parameter, EditorRequired]
    public string Id { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    [Parameter]
    public string Value { get; set; } = string.Empty;

    [Parameter]
    public bool Copyable { get; set; } = true;

    [Parameter]
    public bool Multiline { get; set; }

    [Parameter]
    public string CopyLabel { get; set; } = "copy";
}
