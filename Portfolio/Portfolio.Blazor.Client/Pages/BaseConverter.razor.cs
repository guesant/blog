using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
    private string Action => L["legacy_9176a6f6d181"];
    private string Title => L["legacy_fdef8c68bcf3"];
    private string Description => L["legacy_2430669ec08b"];
    private string InputLabel => L["legacy_67f93fb28065"];
    private string ValueLabel => L["legacy_397b9fc38aec"];
    private string FromLabel => L["legacy_e0d053715998"];
    private string ToLabel => L["legacy_d95ba9b28604"];
    private string SubmitLabel => L["legacy_1b13315a70e3"];
    private string ResultLabel => L["legacy_d9b2a61fb8b3"];
    private string ErrorLabel => L["legacy_0316235fdf16"];
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
