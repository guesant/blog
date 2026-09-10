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
    private string Action => L["legacy_afe22151ab44"];
    private string Title => L["legacy_cfa18146b0f7"];
    private string Description => L["legacy_896563a8c8f0"];
    private string InputLabel => L["legacy_caeab30bd75f"];
    private string VoltageLabel => L["legacy_0fa2b3e4cbe4"];
    private string CurrentLabel => L["legacy_63919d049b72"];
    private string ResistanceLabel => L["legacy_45a194dbc421"];
    private string PowerLabel => L["legacy_c75e63a07ced"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string ErrorMessage =>
        Result.Error == OhmLawError.NeedTwoValues
            ? (L["legacy_3092f378de8d"])
            : (L["legacy_01353e8bc6f0"]);
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
