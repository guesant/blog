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
    private string Action => L["tools_morse_code_translator"];
    private string Title => ToolsL["morse_code_translator_page_title"];
    private string Description => ToolsL["morse_code_translator_lead"];
    private string InputLabel => L["input"];
    private string OutputLabel => L["output"];
    private string ToMorseLabel => L["text_to_morse"];
    private string ToTextLabel => L["morse_to_text"];
    private string ErrorLabel => L["invalid_morse_code"];
    private string CopyLabel => L["copy"];
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
