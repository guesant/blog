using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
    private string Action => L["legacy_99f33be40dd2"];
    private string Title => L["legacy_e59a04d80fff"];
    private string Description => L["legacy_9bc5b47b831b"];
    private string InputLabel => L["legacy_2c18cd904ab1"];
    private string OutputLabel => L["legacy_5271811ebe62"];
    private string ShiftLabel => L["legacy_afa1ac95c295"];
    private static string Rot13Label => "ROT13";
    private string EncodeLabel => L["legacy_360020cc7b01"];
    private string DecodeLabel => L["legacy_4c0e9b70ce8c"];
    private string CopyLabel => L["legacy_b4bdba0acbfb"];
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
