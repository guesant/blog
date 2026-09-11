namespace Portfolio.Blazor.UI.Layout;

public partial class SiteSection
{
    [Parameter]
    public string? Label { get; set; }

    /// <summary>Icon rendered before the section label.</summary>
    [Parameter]
    public string? Icon { get; set; }

    [Parameter]
    public string? Title { get; set; }

    [Parameter]
    public string? Description { get; set; }

    [Parameter]
    public string? Id { get; set; }

    [Parameter]
    public string Region { get; set; } = "section";

    [Parameter]
    public string HeadingId { get; set; } = "section-heading";

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public string? ActionHref { get; set; }

    [Parameter]
    public string? ActionLabel { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
    private IReadOnlyDictionary<string, object> SectionAttributes =>
        string.IsNullOrWhiteSpace(Id)
            ? new Dictionary<string, object>()
            : new Dictionary<string, object> { ["id"] = Id! };
}
