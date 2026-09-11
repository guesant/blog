using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class CompositionCalculator
{
    private string CanonicalPath => RequestPath;
    private string _formulaText = "H2SO4";
    private MolarMassResult _result = MolarMassCalculator.Calculate("H2SO4");
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "formula")]
    private string? QueryFormula { get; set; }
    private string Action => L["tools_composition_calculator"];
    private string Title => ToolsL["composition_calculator_title"];
    private string Description => ToolsL["composition_calculator_lead"];
    private string Note => L["use_formulas_such_as_h2so4_or_ca_oh_2"];
    private string InputLabel => L["parameters"];
    private string FormulaLabel => L["formula"];
    private string MolarMassLabel => L["molar_mass"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_a_valid_chemical_formula"];
    private string FormulaText
    {
        get => _formulaText;
        set
        {
            _formulaText = value;
            Recalculate();
        }
    }
    private MolarMassResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _formulaText = QueryFormula ?? _formulaText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() => _result = MolarMassCalculator.Calculate(_formulaText);

    private static string Format(double value) =>
        value.ToString("N3", CultureInfo.InvariantCulture);
}
