namespace Blog.Blazor.UI.Layout;

public partial class SiteListingShell
{
    [Parameter]
    public RenderFragment? FilterContent { get; set; }

    /// <summary>Optional controls between the filters and the results, such as a view switch.</summary>
    [Parameter]
    public RenderFragment? ToolbarContent { get; set; }

    [Parameter]
    public bool HasResults { get; set; }

    [Parameter]
    public RenderFragment? ResultContent { get; set; }

    [Parameter]
    public RenderFragment? EmptyContent { get; set; }

    [Parameter]
    public int CurrentPage { get; set; } = 1;

    [Parameter]
    public int TotalPages { get; set; }

    [Parameter]
    public bool ShowPagination { get; set; } = true;

    /// <summary>Optional "showing X of Y, page A of B" line rendered under the pagination.</summary>
    [Parameter]
    public string? Summary { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public string PaginationLabel { get; set; } = "pagination";

    [Parameter]
    public string PreviousLabel { get; set; } = "previous";

    [Parameter]
    public string NextLabel { get; set; } = "next";

    [Parameter, EditorRequired]
    public Func<int, string> Href { get; set; } = default!;
}
