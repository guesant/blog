using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class RomanNumeralConverter
{
    private string CanonicalPath => RequestPath;
    private string _numberText = "2024",
        _romanText = "MMXXIV";
    private bool _queryInitialized;
    private RomanNumeralResult _result = new(true, "MMXXIV", "2024", true);

    [SupplyParameterFromQuery(Name = "number")]
    private int? QueryNumber { get; set; }

    [SupplyParameterFromQuery(Name = "roman")]
    private string? QueryRoman { get; set; }
    private string Action => L["tools_roman_numeral_converter"];
    private string Title => ToolsL["roman_numeral_converter_page_title"];
    private string Description => ToolsL["roman_numeral_converter_lead"];
    private string InputLabel => L["inputs"];
    private string NumberLabel => L["number_1_3999"];
    private string RomanLabel => L["roman_numeral"];
    private string NumberError => L["enter_a_whole_number_between_1_and_3999"];
    private string RomanError => L["not_a_valid_roman_numeral"];
    private string ConvertLabel => L["converter"];
    private string NumberText
    {
        get => _numberText;
        set
        {
            _numberText = value;
            var valid = int.TryParse(value, out var number) && number is >= 1 and <= 3999;
            if (valid)
                _romanText = RomanNumerals.ToRoman(number);
            Recalculate();
        }
    }
    private string RomanText
    {
        get => _romanText;
        set
        {
            _romanText = value;
            var number = RomanNumerals.FromRoman(value);
            if (number.HasValue)
                _numberText = number.Value.ToString();
            Recalculate();
        }
    }
    private RomanNumeralResult Result => _result;
    private bool NumberValid => Result.NumberValid;
    private bool RomanValid => Result.RomanValid;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QueryNumber.HasValue)
            _numberText = QueryNumber.Value.ToString();
        if (QueryRoman is not null)
            _romanText = QueryRoman;
        Recalculate();
        _queryInitialized = true;
    }

    private void Recalculate()
    {
        var numberValid = int.TryParse(_numberText, out var number) && number is >= 1 and <= 3999;
        var fromRoman = RomanNumerals.FromRoman(_romanText);
        _result = new(
            numberValid,
            numberValid ? RomanNumerals.ToRoman(number) : "",
            fromRoman?.ToString() ?? "",
            fromRoman.HasValue
        );
    }

    private void RecalculateFromNumber()
    {
        var valid = int.TryParse(_numberText, out var number) && number is >= 1 and <= 3999;
        _result = _result with
        {
            NumberValid = valid,
            RomanFromNumber = valid ? RomanNumerals.ToRoman(number) : "",
        };
    }

    private void RecalculateFromRoman()
    {
        var number = RomanNumerals.FromRoman(_romanText);
        _result = _result with
        {
            RomanValid = number.HasValue,
            NumberFromRoman = number?.ToString() ?? "",
        };
    }
}
