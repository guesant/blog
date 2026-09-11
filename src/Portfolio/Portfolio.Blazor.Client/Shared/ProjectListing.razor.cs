using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class ProjectListing<TItem>
{
    [Parameter, EditorRequired]
    public IReadOnlyList<TItem> Items { get; set; } = [];

    [Parameter]
    public string? Summary { get; set; }

    [Parameter]
    public int CurrentPage { get; set; } = 1;

    [Parameter]
    public int TotalPages { get; set; }

    [Parameter, EditorRequired]
    public string PaginationLabel { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string PreviousLabel { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string NextLabel { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public Func<int, string> Href { get; set; } = default!;

    [Parameter, EditorRequired]
    public string Action { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string SortId { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string SortName { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string SortLabel { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string SortValue { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public EventCallback<string> SortValueChanged { get; set; }

    [Parameter, EditorRequired]
    public IReadOnlyList<SiteSelectOption> SortOptions { get; set; } = [];

    [Parameter]
    public string SortPlaceholder { get; set; } = string.Empty;

    [Parameter]
    public string SortEmptyText { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string SearchLabel { get; set; } = string.Empty;

    [Parameter]
    public string SearchName { get; set; } = "q";

    [Parameter]
    public string SearchValue { get; set; } = string.Empty;

    [Parameter]
    public EventCallback<string> SearchValueChanged { get; set; }

    [Parameter]
    public string SearchPlaceholder { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string ApplyLabel { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string ClearLabel { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string ClearHref { get; set; } = string.Empty;

    [Parameter]
    public EventCallback OnApply { get; set; }

    [Parameter]
    public string? GridId { get; set; }

    [Parameter]
    public string? GridAriaLabel { get; set; }

    [Parameter]
    public string? GridAriaLabelledBy { get; set; }

    [Parameter, EditorRequired]
    public string KindLabel { get; set; } = string.Empty;

    [Parameter]
    public string? ViewLabel { get; set; }

    [Parameter, EditorRequired]
    public Func<TItem, string> ItemHref { get; set; } = default!;

    [Parameter, EditorRequired]
    public Func<TItem, string> ItemTitle { get; set; } = default!;

    [Parameter, EditorRequired]
    public Func<TItem, string?> ItemStatusLabel { get; set; } = default!;

    [Parameter, EditorRequired]
    public Func<TItem, string?> ItemDate { get; set; } = default!;

    [Parameter, EditorRequired]
    public Func<TItem, string?> ItemPurpose { get; set; } = default!;

    [Parameter]
    public Func<TItem, string?>? ItemProblem { get; set; }

    [Parameter, EditorRequired]
    public Func<TItem, IReadOnlyList<PublicTechnology>?> ItemTechnologies { get; set; } = default!;

    [Parameter, EditorRequired]
    public Func<PublicTechnology, string> TechnologyUrl { get; set; } = default!;

    private string? ItemPreview(TItem item)
    {
        var parts = new[] { ItemPurpose(item), ItemProblem?.Invoke(item) }
            .Where(part => !string.IsNullOrWhiteSpace(part))
            .Select(part => part!.Trim());
        var preview = string.Join(" ", parts);
        return string.IsNullOrWhiteSpace(preview) ? null : preview;
    }
}
