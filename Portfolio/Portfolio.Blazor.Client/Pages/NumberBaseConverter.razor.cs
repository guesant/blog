using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class NumberBaseConverter
{
    private string CanonicalPath => RequestPath;
    private string _value = "255";
    private int _selectedBase;
    private NumberBaseConversionResult _result = NumberBaseConversionCalculator.Convert("255", 0);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "value")]
    private string? QueryValue { get; set; }

    [SupplyParameterFromQuery(Name = "base")]
    private int? QueryBase { get; set; }
    private string Action => L["legacy_01570c7c3e35"];
    private string Title => L["legacy_4d67bbd8d9f3"];
    private string Description => L["legacy_4b9d3bbe1443"];
    private string InputLabel => L["legacy_b831d42d15e4"];
    private static string BaseLabel => "base";
    private string ResultLabel => L["legacy_2f0452494fcb"];
    private string SubmitLabel => L["legacy_ae125407093e"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string ErrorLabel => L["legacy_43f55e54b620"];
    private IReadOnlyList<(int Value, string Label)> BaseOptions =>
        [
            (0, L["base_auto"]),
            (2, L["base_binary"]),
            (8, L["base_octal"]),
            (10, L["base_decimal"]),
            (16, L["base_hexadecimal"]),
        ];
    private int SelectedBase
    {
        get => _selectedBase;
        set
        {
            _selectedBase = value;
            Recalculate();
        }
    }
    private string Value
    {
        get => _value;
        set
        {
            _value = value;
            Recalculate();
        }
    }
    private NumberBaseConversionResult Result => _result;
    private IEnumerable<(string Id, string Label, string Value)> Outputs =>
        [
            ("number-base-binary", L["legacy_259a815454af"], Result.Binary),
            ("number-base-octal", "octal", Result.Octal),
            ("number-base-decimal", "decimal", Result.Decimal),
            ("number-base-hexadecimal", "hexadecimal", Result.Hexadecimal),
        ];

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _value = QueryValue ?? _value;
        if (QueryBase is 0 or 2 or 8 or 10 or 16)
            _selectedBase = QueryBase.Value;
        Recalculate();
        _queryInitialized = true;
    }

    private void SelectBase(int value) => SelectedBase = value;

    private void Recalculate() =>
        _result = NumberBaseConversionCalculator.Convert(_value, _selectedBase);
}
