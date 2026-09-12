using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class ColorConverter
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty;
    private ColorConversionResult _result = ColorConversionCalculator.Convert(null);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }
    private string Action => L["tools_color_converter"];
    private string Title => ToolsL["color_converter_title"];
    private string Description => ToolsL["color_converter_lead"];
    private string InputLabel => L["color"];
    private string SubmitLabel => L["convert"];
    private string InvalidLabel => L["invalid_color"];
    private string SwatchLabel => L["color_preview"];
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
