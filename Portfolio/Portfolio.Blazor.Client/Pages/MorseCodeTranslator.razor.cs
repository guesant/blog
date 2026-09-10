using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class MorseCodeTranslator
{
    private string CanonicalPath => RequestPath;
    private string _input = "",
        _direction = "encode";
    private bool _queryInitialized;
    private MorseResult _result = new(true, "", null);

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }

    [SupplyParameterFromQuery(Name = "direction")]
    private string? QueryDirection { get; set; }
    private string Action => L["legacy_66dfbbab2970"];
    private string Title => L["legacy_25535b2d3899"];
    private string Description => L["legacy_12417cfb8f50"];
    private string InputLabel => L["legacy_c4c61716670f"];
    private string OutputLabel => L["legacy_1d1c0e33dc3c"];
    private string ToMorseLabel => L["legacy_4e4de170a862"];
    private string ToTextLabel => L["legacy_357fb6de54be"];
    private string ErrorLabel => L["legacy_30fb3ba22e8c"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string Input
    {
        get => _input;
        set
        {
            _input = value;
            Recalculate();
        }
    }
    private MorseResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? _input;
        _direction = QueryDirection is "decode" ? "decode" : "encode";
        Recalculate();
        _queryInitialized = true;
    }

    private void Recalculate() => _result = MorseCode.Transform(_input, _direction);

    private void ToMorse()
    {
        _direction = "encode";
        Recalculate();
    }

    private void ToText()
    {
        _direction = "decode";
        Recalculate();
    }
}
