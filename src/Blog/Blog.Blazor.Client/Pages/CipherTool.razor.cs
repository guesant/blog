using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class CipherTool
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty;
    private string _shiftText = "13";
    private string _operation = "encode";
    private string _result = string.Empty;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }

    [SupplyParameterFromQuery(Name = "shift")]
    private int? QueryShift { get; set; }

    [SupplyParameterFromQuery(Name = "operation")]
    private string? QueryOperation { get; set; }
    private string Action => L["tools_cipher_tool"];
    private string Title => ToolsL["cipher_tool_title"];
    private string Description => ToolsL["cipher_tool_lead"];
    private string InputLabel => L["input"];
    private string OutputLabel => L["output"];
    private string ShiftLabel => L["shift"];
    private static string Rot13Label => "ROT13";
    private string EncodeLabel => L["encode"];
    private string DecodeLabel => L["decode"];
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
    private string ShiftText
    {
        get => _shiftText;
        set
        {
            _shiftText = value;
            Recalculate();
        }
    }
    private string Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? _input;
        if (QueryShift.HasValue)
            _shiftText = QueryShift.Value.ToString(
                System.Globalization.CultureInfo.InvariantCulture
            );
        _operation = QueryOperation is "decode" or "rot13" ? QueryOperation : "encode";
        if (_operation == "rot13")
            _shiftText = "13";
        Recalculate();
        _queryInitialized = true;
    }

    private int Shift => int.TryParse(ShiftText, out var shift) ? shift : 0;

    private void Encode()
    {
        _operation = "encode";
        Recalculate();
    }

    private void Decode()
    {
        _operation = "decode";
        Recalculate();
    }

    private void Rot13()
    {
        _shiftText = "13";
        _operation = "rot13";
        Recalculate();
    }

    private void Recalculate() =>
        _result = CaesarCipher.Transform(_input, Shift, _operation == "decode");
}
