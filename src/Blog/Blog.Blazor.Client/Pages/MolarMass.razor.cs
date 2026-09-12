using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class MolarMass
{
    private string CanonicalPath => RequestPath;
    private string _formula = "Ca(OH)2";
    private MolarMassResult _result = MolarMassCalculator.Calculate("Ca(OH)2");
    private bool _queryInitialized;
    private bool _compositionTablePending;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "formula")]
    private string? QueryFormula { get; set; }
    private string Action => L["tools_molar_mass"];
    private string Title => ToolsL["molar_mass_title"];
    private string Description => ToolsL["molar_mass_lead"];
    private string InputLabel => L["chemical_formula"];
    private string SubmitLabel => L["calculate"];
    private string ResultLabel => L["result"];
    private string MolarMassLabel => L["molar_mass_label"];
    private string CompositionLabel => L["percentage_composition"];
    private string ElementLabel => L["element"];
    private string AtomsLabel => L["atoms"];
    private string PercentageLabel => L["percentage"];
    private string CompositionTableId => L["molar_composition_pt"];
    private string ErrorMessage =>
        Result.Error switch
        {
            MolarMassError.EmptyFormula => L["provide_a_chemical_formula"],
            MolarMassError.UnknownElement => L["the_formula_contains_an_unknown_element"],
            _ => L["the_chemical_formula_is_invalid"],
        };
    private string Formula
    {
        get => _formula;
        set
        {
            _formula = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private MolarMassResult Result => _result;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _formula = QueryFormula ?? _formula;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate()
    {
        _result = MolarMassCalculator.Calculate(_formula);
        _compositionTablePending = true;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (RendererInfo.IsInteractive && _compositionTablePending && Result.IsValid)
        {
            _compositionTablePending = false;
            var rows = Result
                .Composition.Select(element =>
                    new[]
                    {
                        element.Symbol,
                        element.AtomCount.ToString(),
                        $"{Format(element.Percentage)}%",
                    }
                )
                .ToArray();
            await JS.InvokeVoidAsync(
                "tableEditor.initializeTabulator",
                CompositionTableId,
                new[] { ElementLabel, AtomsLabel, PercentageLabel },
                rows
            );
        }
    }

    private static string Format(double value) =>
        value.ToString("N3", CultureInfo.InvariantCulture);

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
