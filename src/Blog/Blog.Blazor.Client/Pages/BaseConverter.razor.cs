using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class BaseConverter
{
    private string CanonicalPath => RequestPath;
    private string _valueText = "FF",
        _fromText = "16",
        _toText = "10";
    private BaseConversionResult _result = BaseConversionCalculator.Convert("FF", 16, 10);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "value")]
    private string? QueryValue { get; set; }

    [SupplyParameterFromQuery(Name = "from")]
    private string? QueryFrom { get; set; }

    [SupplyParameterFromQuery(Name = "to")]
    private string? QueryTo { get; set; }
    private string Action => L["tools_base_converter"];
    private string Title => ToolsL["base_converter_title"];
    private string Description => ToolsL["base_converter_lead"];
    private string InputLabel => L["input_values"];
    private string ValueLabel => L["value"];
    private string FromLabel => L["source_base"];
    private string ToLabel => L["target_base"];
    private string SubmitLabel => L["convert"];
    private string ResultLabel => L["result"];
    private string ErrorLabel => L["use_a_valid_integer_and_bases_between_2_and_36"];
    private string ValueText
    {
        get => _valueText;
        set
        {
            _valueText = value;
            Recalculate();
        }
    }
    private string FromText
    {
        get => _fromText;
        set
        {
            _fromText = value;
            Recalculate();
        }
    }
    private string ToText
    {
        get => _toText;
        set
        {
            _toText = value;
            Recalculate();
        }
    }
    private BaseConversionResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _valueText = QueryValue ?? _valueText;
        _fromText = QueryFrom ?? _fromText;
        _toText = QueryTo ?? _toText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = BaseConversionCalculator.Convert(_valueText, Parse(_fromText), Parse(_toText));

    private static int Parse(string value) => int.TryParse(value, out var result) ? result : 0;
}
