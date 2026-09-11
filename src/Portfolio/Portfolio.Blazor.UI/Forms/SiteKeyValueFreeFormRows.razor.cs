namespace Portfolio.Blazor.UI.Forms;

public partial class SiteKeyValueFreeFormRows
{
    /// <summary>Id prefix for generated row element ids, matching the owning input's RootId.</summary>
    [Parameter, EditorRequired]
    public string RootId { get; set; } = string.Empty;

    /// <summary>The full backing row list; only the rows named by <see cref="Indices"/> are rendered.</summary>
    [Parameter, EditorRequired]
    public IReadOnlyList<(string Key, string Value)> Rows { get; set; } = [];

    /// <summary>Indices into <see cref="Rows"/> to render as free-form key/value pairs.</summary>
    [Parameter, EditorRequired]
    public IReadOnlyList<int> Indices { get; set; } = [];

    [Parameter]
    public bool ShowSectionLabel { get; set; }

    [Parameter]
    public string SectionLabel { get; set; } = "Other fields";

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public string? RowClass { get; set; }

    [Parameter]
    public string KeyPlaceholder { get; set; } = "key";

    [Parameter]
    public string ValuePlaceholder { get; set; } = "value";

    [Parameter]
    public string AddLabel { get; set; } = "add";

    [Parameter]
    public string RemoveLabel { get; set; } = "remove";

    [Parameter, EditorRequired]
    public EventCallback<(int Index, string Value)> KeyChanged { get; set; }

    [Parameter, EditorRequired]
    public EventCallback<(int Index, string Value)> ValueEdited { get; set; }

    [Parameter, EditorRequired]
    public EventCallback<int> Removed { get; set; }

    [Parameter, EditorRequired]
    public EventCallback Added { get; set; }
}
