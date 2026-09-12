namespace Blog.Blazor.UI.Navigation;

public partial class SiteNavLink
{
    [Parameter, EditorRequired]
    public string Href { get; set; } = string.Empty;

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public string? Target { get; set; }

    [Parameter]
    public string? Rel { get; set; }

    [Parameter]
    public string? AriaCurrent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private string LinkClass =>
        string.Join(
            ' ',
            new[] { "nav-link", "sidebar-action", Class }.Where(value =>
                !string.IsNullOrWhiteSpace(value)
            )
        );
}
