using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
    private string Action => L["legacy_2d48c5d79f5c"];
    private string Title => ToolsL["roman_numeral_converter_page_title"];
    private string Description => ToolsL["roman_numeral_converter_lead"];
    private string InputLabel => L["legacy_f2f2808523c8"];
    private string NumberLabel => L["legacy_92b2672538ae"];
    private string RomanLabel => L["legacy_d94d480b36f3"];
    private string NumberError => L["legacy_823478c8c529"];
    private string RomanError => L["legacy_e899045f5495"];
    private string ConvertLabel => L["legacy_ae125407093e"];
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
