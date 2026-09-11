using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class ChemicalEquationBalancer
{
    private string CanonicalPath => RequestPath;
    private string _equationText = "Fe + O2 → Fe2O3";
    private ChemicalBalanceResult _result = Portfolio.Blazor.Core.ChemicalEquationBalancer.Balance(
        "Fe + O2 → Fe2O3"
    );
    private bool _queryInitialized;
    private bool _tablePending;

    [SupplyParameterFromQuery(Name = "equation")]
    private string? QueryEquation { get; set; }
    private string Action => L["tools_chemical_equation_balancer"];
    private string Title => ToolsL["chemical_equation_balancer_title"];
    private string Description => ToolsL["chemical_equation_balancer_lead"];
    private string InputLabel => L["equation_reactants_products"];
    private string TableLabel => L["atom_count_by_species"];
    private string ElementLabel => L["element"];
    private string SubmitLabel => L["balance"];
    private string ErrorLabel => L["provide_a_valid_equation_such_as_fe_o2_fe2o3"];
    private string TableId => L["chemical_atoms"];
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));
    private string EquationText
    {
        get => _equationText;
        set
        {
            _equationText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private ChemicalBalanceResult Result => _result;
    private List<int> RowIndexes => Enumerable.Range(0, Result.Elements.Count).ToList();

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _equationText = QueryEquation ?? _equationText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate()
    {
        _result = Portfolio.Blazor.Core.ChemicalEquationBalancer.Balance(_equationText);
        _tablePending = true;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (RendererInfo.IsInteractive && _tablePending && Result.IsValid)
        {
            _tablePending = false;
            var rows = Result
                .Elements.Select(
                    (element, index) =>
                        new[] { element }
                            .Concat(Result.Counts[index].Select(count => count.ToString()))
                            .ToArray()
                )
                .ToArray();
            await JS.InvokeVoidAsync(
                "tableEditor.initializeTabulator",
                TableId,
                new[] { ElementLabel }.Concat(Result.Terms).ToArray(),
                rows
            );
        }
    }

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
