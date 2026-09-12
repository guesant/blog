using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class ChemistryAmount
{
    private string CanonicalPath => RequestPath;
    private string _massText = "18";
    private string _molarMassText = "18.015";
    private ChemistryAmountResult _result = ChemistryAmountCalculator.FromMass(18, 18.015);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "mass")]
    private string? QueryMass { get; set; }

    [SupplyParameterFromQuery(Name = "molar-mass")]
    private string? QueryMolarMass { get; set; }
    private string Action => L["tools_moles_calculator"];
    private string Title => ToolsL["moles_calculator_title"];
    private string Description => ToolsL["moles_calculator_lead"];
    private string InputLabel => L["parameters"];
    private string MassLabel => L["mass_g"];
    private string MolarMassLabel => L["molar_mass_g_mol"];
    private string MolesLabel => L["amount_of_substance"];
    private string ParticlesLabel => L["particles"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_a_non_negative_mass_and_a_positive"];
    private string MassText
    {
        get => _massText;
        set
        {
            _massText = value;
            Recalculate();
        }
    }
    private string MolarMassText
    {
        get => _molarMassText;
        set
        {
            _molarMassText = value;
            Recalculate();
        }
    }
    private ChemistryAmountResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _massText = QueryMass ?? _massText;
        _molarMassText = QueryMolarMass ?? _molarMassText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = ChemistryAmountCalculator.FromMass(Parse(_massText), Parse(_molarMassText));

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Format(double value) =>
        value.ToString("G8", CultureInfo.InvariantCulture);
}
