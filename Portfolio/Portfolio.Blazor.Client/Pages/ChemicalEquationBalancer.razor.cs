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
    private string Action => L["legacy_2ca4c29bb9f9"];
    private string Title => L["legacy_0843a7a3eac8"];
    private string Description => L["legacy_75e85c5ece00"];
    private string InputLabel => L["legacy_3dbfde4d48d6"];
    private string TableLabel => L["legacy_90020d6d564f"];
    private string ElementLabel => L["legacy_9d4c071bfb3b"];
    private string SubmitLabel => L["legacy_180d6c2be1ef"];
    private string ErrorLabel => L["legacy_99e8cb3ad9b1"];
    private string TableId => L["legacy_6102425dbbd6"];
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
