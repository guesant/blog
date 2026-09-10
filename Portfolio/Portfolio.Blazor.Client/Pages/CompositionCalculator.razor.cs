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
    private string Action => L["legacy_f82761af13b1"];
    private string Title => L["legacy_e9eef96ab56f"];
    private string Description => L["legacy_eda1e418f9a0"];
    private string Note => L["legacy_ccbeda9455e8"];
    private string InputLabel => L["legacy_5b6220fefc5c"];
    private string FormulaLabel => L["legacy_82c24536a3b2"];
    private string MolarMassLabel => L["legacy_252cc9dd1546"];
    private string SubmitLabel => L["legacy_37565a968d31"];
    private string ErrorLabel => L["legacy_34e901c4869b"];
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
