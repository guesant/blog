namespace Portfolio.Blazor.UI.DataDisplay;

public partial class SiteTable
{
    /// <summary>Table caption.</summary>
    [Parameter]
    public string? Caption { get; set; }

    /// <summary>Base class applied to the table element itself, e.g. "table table-sm table-striped".</summary>
    [Parameter]
    public string TableClass { get; set; } = "table";

    /// <summary>Extra class applied to the scroll wrapper.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
