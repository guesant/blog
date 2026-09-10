using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class ColorConverter
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty;
    private ColorConversionResult _result = ColorConversionCalculator.Convert(null);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }
    private string Action => L["legacy_df66e9cdaf90"];
    private string Title => L["legacy_c041764a8da9"];
    private string Description => L["legacy_3684f22a4a57"];
    private string InputLabel => L["legacy_cde7b59ed555"];
    private string SubmitLabel => L["legacy_1b13315a70e3"];
    private string InvalidLabel => L["legacy_f2c2bf99db31"];
    private string SwatchLabel => L["legacy_c7602f73e7c0"];
    private static string HexLabel => "HEX";
    private static string RgbLabel => "RGB";
    private static string HslLabel => "HSL";
    private string Input
    {
        get => _input;
        set
        {
            _input = value;
            _result = ColorConversionCalculator.Convert(value);
        }
    }
    private ColorConversionResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? _input;
        _result = ColorConversionCalculator.Convert(_input);
        _queryInitialized = true;
    }
}
