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
    private string Action => L["legacy_a10872a86f7d"];
    private string Title => ToolsL["resistor_network_title"];
    private string Description => ToolsL["resistor_network_lead"];
    private string Note => L["legacy_3cb74ef347b2"];
    private string InputLabel => L["legacy_bdae964b227c"];
    private string ModeLabel => L["legacy_5446bebbd295"];
    private string SeriesLabel => L["legacy_764f33d20532"];
    private string ParallelLabel => L["legacy_df997cffd89b"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string ErrorLabel => L["legacy_7df58ea38277"];
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
