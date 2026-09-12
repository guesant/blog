namespace Blog.Blazor.UI.Composition;

public partial class SiteFormShell
{
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    [Parameter]
    public string? BackHref { get; set; }

    [Parameter]
    public string? BackLabel { get; set; }

    /// <summary>Secondary header actions (e.g. a preview link, delete button), forwarded to the underlying SitePageHeader.</summary>
    [Parameter]
    public RenderFragment? Actions { get; set; }

    [Parameter]
    public string? Error { get; set; }

    [Parameter]
    public bool Loading { get; set; }

    [Parameter]
    public string LoadingLabel { get; set; } = "Loading…";

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
