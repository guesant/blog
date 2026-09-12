namespace Blog.Blazor.Client.Shared;

public partial class ToolPage
{
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    [Parameter]
    public string Description { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string CanonicalPath { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    [Parameter]
    public string? Slug { get; set; }

    [Parameter]
    public string State { get; set; } = "functional";

    private string ResolvedSlug =>
        Slug ?? CanonicalPath.TrimEnd('/').Split('/').LastOrDefault() ?? string.Empty;
}
