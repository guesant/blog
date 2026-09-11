using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class PeriodicTable
{
    private string CanonicalPath => RequestPath;
    private string _search = string.Empty;
    private bool _queryInitialized;
    private ChemicalElement? Selected { get; set; } = PeriodicTableReference.All.First();
    private static IReadOnlyList<ChemicalElement> Elements => PeriodicTableReference.All;
    private static IReadOnlyDictionary<string, int> elementBySymbol =>
        Elements
            .Select((element, index) => (element.Symbol, index))
            .ToDictionary(item => item.Symbol, item => item.index);

    [SupplyParameterFromQuery(Name = "search")]
    private string? QuerySearch { get; set; }
    private string Action => L["tools_periodic_table"];
    private string Title => ToolsL["periodic_table_title"];
    private string Description => ToolsL["periodic_table_lead"];
    private string SearchLabel => L["search_element"];
    private string SearchButton => L["search"];
    private string SeriesNote => L["lanthanides_and_actinides_are_displayed_in"];
    private string SymbolLabel => L["symbol"];
    private string NameLabel => L["name"];
    private string AtomicNumberLabel => L["atomic_number"];
    private string CategoryLabel => L["category"];
    private string Search
    {
        get => _search;
        set => _search = value;
    }

    private bool Matches(ChemicalElement element) =>
        $"{element.Symbol} {element.Name}".Contains(Search, StringComparison.OrdinalIgnoreCase);

    private void Select(ChemicalElement element) => Selected = element;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _search = QuerySearch ?? string.Empty;
        _queryInitialized = true;
    }
}
