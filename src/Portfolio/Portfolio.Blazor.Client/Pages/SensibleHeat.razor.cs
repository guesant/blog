using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class SensibleHeat
{
    private string CanonicalPath => RequestPath;
    private string _massText = "2";
    private string _specificHeatText = "4";
    private string _deltaTemperatureText = "10";
    private SensibleHeatResult _result = PhysicsCalculator.SensibleHeat(2, 4, 10);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "mass")]
    private string? QueryMass { get; set; }

    [SupplyParameterFromQuery(Name = "specific")]
    private string? QuerySpecificHeat { get; set; }

    [SupplyParameterFromQuery(Name = "delta")]
    private string? QueryDeltaTemperature { get; set; }
    private string Action => L["tools_sensible_heat"];
    private string Title => ToolsL["sensible_heat_title"];
    private string Description => ToolsL["sensible_heat_lead"];
    private string Note => L["use_mass_in_kg_specific_heat_in_j_kg_k_and"];
    private string InputLabel => L["parameters"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_valid_heat_parameters"];
    private string MassText
    {
        get => _massText;
        set
        {
            _massText = value;
            Recalculate();
        }
    }
    private string SpecificHeatText
    {
        get => _specificHeatText;
        set
        {
            _specificHeatText = value;
            Recalculate();
        }
    }
    private string DeltaTemperatureText
    {
        get => _deltaTemperatureText;
        set
        {
            _deltaTemperatureText = value;
            Recalculate();
        }
    }
    private SensibleHeatResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _massText = QueryMass ?? _massText;
        _specificHeatText = QuerySpecificHeat ?? _specificHeatText;
        _deltaTemperatureText = QueryDeltaTemperature ?? _deltaTemperatureText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = PhysicsCalculator.SensibleHeat(
            Parse(_massText),
            Parse(_specificHeatText),
            Parse(_deltaTemperatureText)
        );

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Heat(double value) => value.ToString("N3", CultureInfo.InvariantCulture);
}
