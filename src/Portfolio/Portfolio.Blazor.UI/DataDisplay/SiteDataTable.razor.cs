namespace Portfolio.Blazor.UI.DataDisplay;

public partial class SiteDataTable<TItem>
{
    /// <summary>Rows to render.</summary>
    [Parameter, EditorRequired]
    public IReadOnlyList<TItem> Items { get; set; } = [];

    /// <summary>Table caption.</summary>
    [Parameter]
    public string? Caption { get; set; }

    /// <summary>Text shown in a single spanning row when Items is empty.</summary>
    [Parameter, EditorRequired]
    public string EmptyText { get; set; } = string.Empty;

    /// <summary>Visually-hidden accessible name for the actions column header.</summary>
    [Parameter]
    public string ActionsHeader { get; set; } = "Actions";

    /// <summary>Stable key for each row, used for diffing.</summary>
    [Parameter, EditorRequired]
    public Func<TItem, object> RowKey { get; set; } = default!;

    /// <summary>SiteColumn children describing the table's columns.</summary>
    [Parameter, EditorRequired]
    public RenderFragment Columns { get; set; } = default!;

    /// <summary>Optional per-row actions cell.</summary>
    [Parameter]
    public RenderFragment<TItem>? Actions { get; set; }

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    internal List<SiteColumnDefinition<TItem>> ColumnList { get; } = [];

    internal void RegisterColumn(SiteColumnDefinition<TItem> column) => ColumnList.Add(column);
}
