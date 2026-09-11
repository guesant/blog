namespace Portfolio.Blazor.UI.DataDisplay;

public partial class SiteColumn<TItem>
{
    [CascadingParameter]
    private SiteDataTable<TItem> Table { get; set; } = default!;

    /// <summary>Column header text.</summary>
    [Parameter, EditorRequired]
    public string Header { get; set; } = string.Empty;

    /// <summary>Cell content for a given row.</summary>
    [Parameter, EditorRequired]
    public RenderFragment<TItem> Cell { get; set; } = default!;

    /// <summary>Renders this column's cell as a row header (th scope=row) instead of td.</summary>
    [Parameter]
    public bool IsRowHeader { get; set; }

    protected override void OnParametersSet() =>
        Table.RegisterColumn(new SiteColumnDefinition<TItem>(Header, Cell, IsRowHeader));
}
