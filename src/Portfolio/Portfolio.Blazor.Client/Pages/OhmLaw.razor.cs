using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class OhmLaw
{
    private string CanonicalPath => RequestPath;
    private string _voltageText = "12";
    private string _currentText = "2";
    private string _resistanceText = string.Empty;
    private string _powerText = string.Empty;
    private OhmLawResult _result = OhmLawCalculator.Solve(12, 2, null, null);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "v")]
    private string? QueryVoltage { get; set; }

    [SupplyParameterFromQuery(Name = "i")]
    private string? QueryCurrent { get; set; }

    [SupplyParameterFromQuery(Name = "r")]
    private string? QueryResistance { get; set; }

    [SupplyParameterFromQuery(Name = "p")]
    private string? QueryPower { get; set; }
    private string Action => L["tools_ohm_law"];
    private string Title => ToolsL["ohm_law_page_title"];
    private string Description => ToolsL["ohm_law_lead"];
    private string InputLabel => L["electrical_values"];
    private string VoltageLabel => L["voltage"];
    private string CurrentLabel => L["current"];
    private string ResistanceLabel => L["resistance"];
    private string PowerLabel => L["power"];
    private string SubmitLabel => L["calculate"];
    private string ErrorMessage =>
        Result.Error == OhmLawError.NeedTwoValues
            ? (L["provide_at_least_two_values"])
            : (L["use_positive_finite_values_only"]);
    private string VoltageText
    {
        get => _voltageText;
        set
        {
            _voltageText = value;
            Recalculate();
        }
    }
    private string CurrentText
    {
        get => _currentText;
        set
        {
            _currentText = value;
            Recalculate();
        }
    }
    private string ResistanceText
    {
        get => _resistanceText;
        set
        {
            _resistanceText = value;
            Recalculate();
        }
    }
    private string PowerText
    {
        get => _powerText;
        set
        {
            _powerText = value;
            Recalculate();
        }
    }
    private OhmLawResult Result => _result;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _voltageText = QueryVoltage ?? _voltageText;
            _currentText = QueryCurrent ?? _currentText;
            _resistanceText = QueryResistance ?? _resistanceText;
            _powerText = QueryPower ?? _powerText;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate() =>
        _result = OhmLawCalculator.Solve(
            ParseNullable(_voltageText),
            ParseNullable(_currentText),
            ParseNullable(_resistanceText),
            ParseNullable(_powerText)
        );

    private static double? ParseNullable(string? value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : null;

    private static string Format(double value) =>
        (value == 0 ? 0 : value).ToString("G12", CultureInfo.InvariantCulture);
}
