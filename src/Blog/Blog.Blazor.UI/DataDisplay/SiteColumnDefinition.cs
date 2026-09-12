using Microsoft.AspNetCore.Components;

namespace Blog.Blazor.UI.DataDisplay;

/// <summary>Internal column registration used by SiteDataTable/SiteColumn.</summary>
public sealed class SiteColumnDefinition<TItem>
{
    /// <summary>Registers a column with its header, cell template and row-header flag.</summary>
    /// <param name="header">Text shown in the column header.</param>
    /// <param name="cell">Template rendering one cell.</param>
    /// <param name="isRowHeader">Whether the cell is the row's header.</param>
    public SiteColumnDefinition(string header, RenderFragment<TItem> cell, bool isRowHeader)
    {
        Header = header;
        Cell = cell;
        IsRowHeader = isRowHeader;
    }

    /// <summary>Text shown in the column header.</summary>
    public string Header { get; init; }

    /// <summary>Template rendering one cell of this column.</summary>
    public RenderFragment<TItem> Cell { get; init; }

    /// <summary>Whether this column's cell is the row header.</summary>
    public bool IsRowHeader { get; init; }
}
