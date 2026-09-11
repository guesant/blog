using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
    private string Action => L["legacy_87674d2a6642"];
    private string Title => ToolsL["moles_calculator_title"];
    private string Description => ToolsL["moles_calculator_lead"];
    private string InputLabel => L["legacy_5b6220fefc5c"];
    private string MassLabel => L["legacy_885c7112818c"];
    private string MolarMassLabel => L["legacy_81887c406b3b"];
    private string MolesLabel => L["legacy_b265f437a74a"];
    private string ParticlesLabel => L["legacy_9167999e517e"];
    private string SubmitLabel => L["legacy_37565a968d31"];
    private string ErrorLabel => L["legacy_f5480d708716"];
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
