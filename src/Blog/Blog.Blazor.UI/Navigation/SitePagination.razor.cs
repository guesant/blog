namespace Blog.Blazor.UI.Navigation;

public partial class SitePagination
{
    [Parameter]
    public int CurrentPage { get; set; } = 1;

    [Parameter]
    public int TotalPages { get; set; }

    [Parameter]
    public int DisplayPages { get; set; } = 5;

    [Parameter]
    public string AriaLabel { get; set; } = "pagination";

    [Parameter]
    public string PreviousLabel { get; set; } = "previous";

    [Parameter]
    public string NextLabel { get; set; } = "next";

    [Parameter, EditorRequired]
    public Func<int, string> Href { get; set; } = default!;

    private IEnumerable<int> VisiblePages
    {
        get
        {
            var count = Math.Max(1, Math.Min(DisplayPages, TotalPages));
            var first = Math.Clamp(
                CurrentPage - ((count - 1) / 2),
                1,
                Math.Max(1, TotalPages - count + 1)
            );
            return Enumerable.Range(first, count);
        }
    }
}
