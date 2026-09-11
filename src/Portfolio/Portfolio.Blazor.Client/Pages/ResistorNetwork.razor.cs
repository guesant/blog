using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class ResistorNetwork
{
    private string CanonicalPath => RequestPath;
    private string _resistorsText = "100, 220, 330";
    private string _modeText = "series";
    private EquivalentResistanceResult _result = EngineeringCalculator.EquivalentResistance(
        [100, 220, 330],
        "series"
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "resistors")]
    private string? QueryResistors { get; set; }

    [SupplyParameterFromQuery(Name = "mode")]
    private string? QueryMode { get; set; }
    private string Action => L["tools_resistor_network"];
    private string Title => ToolsL["resistor_network_title"];
    private string Description => ToolsL["resistor_network_lead"];
    private string Note => L["enter_positive_values_separated_by_commas"];
    private string InputLabel => L["resistors"];
    private string ModeLabel => L["connection"];
    private string SeriesLabel => L["series"];
    private string ParallelLabel => L["parallel"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["enter_valid_positive_resistors"];
    private string ResistorsText
    {
        get => _resistorsText;
        set
        {
            _resistorsText = value;
            Recalculate();
        }
    }
    private string ModeText
    {
        get => _modeText;
        set
        {
            _modeText = value;
            Recalculate();
        }
    }
    private EquivalentResistanceResult Result => _result;
    private IReadOnlyList<SiteSelectOption> ModeOptions =>
        [new("series", SeriesLabel), new("parallel", ParallelLabel)];

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _resistorsText = QueryResistors ?? _resistorsText;
        _modeText = QueryMode ?? _modeText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = EngineeringCalculator.EquivalentResistance(
            _resistorsText
                .Split([' ', ',', ';'], StringSplitOptions.RemoveEmptyEntries)
                .Select(Parse),
            _modeText
        );

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Resistance(double value) =>
        value.ToString("N3", CultureInfo.InvariantCulture);
}
