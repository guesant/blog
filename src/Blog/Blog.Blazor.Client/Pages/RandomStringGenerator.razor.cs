using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class RandomStringGenerator
{
    private string CanonicalPath => RequestPath;
    private int _length = 12;
    private string _countText = "1";
    private bool _lowercase = true,
        _uppercase = true,
        _numbers = true,
        _symbols,
        _queryInitialized;
    private RandomStringResult _result = RandomNumberTools.GenerateStrings(
        12,
        1,
        true,
        true,
        true,
        false
    );

    [SupplyParameterFromQuery(Name = "length")]
    private int? QueryLength { get; set; }

    [SupplyParameterFromQuery(Name = "count")]
    private int? QueryCount { get; set; }

    [SupplyParameterFromQuery(Name = "lowercase")]
    private bool? QueryLowercase { get; set; }

    [SupplyParameterFromQuery(Name = "uppercase")]
    private bool? QueryUppercase { get; set; }

    [SupplyParameterFromQuery(Name = "numbers")]
    private bool? QueryNumbers { get; set; }

    [SupplyParameterFromQuery(Name = "symbols")]
    private bool? QuerySymbols { get; set; }
    private string Action => L["tools_random_string_generator"];
    private string Title => ToolsL["random_string_generator_title"];
    private string Description => ToolsL["random_string_generator_lead"];
    private string InputLabel => L["parameters"];
    private string LengthLabel => L["length"];
    private string CountLabel => L["how_many_alt"];
    private string LowercaseLabel => L["lowercase"];
    private string UppercaseLabel => L["uppercase"];
    private string NumbersLabel => L["numbers"];
    private string SymbolsLabel => L["symbols"];
    private string GenerateLabel => L["generate"];
    private string ResultLabel => L["results"];
    private string ErrorLabel => L["select_at_least_one_character_set"];
    private int Length
    {
        get => _length;
        set => _length = Math.Clamp(value, 1, 64);
    }
    private string CountText
    {
        get => _countText;
        set => _countText = value;
    }
    private bool Lowercase
    {
        get => _lowercase;
        set => _lowercase = value;
    }
    private bool Uppercase
    {
        get => _uppercase;
        set => _uppercase = value;
    }
    private bool Numbers
    {
        get => _numbers;
        set => _numbers = value;
    }
    private bool Symbols
    {
        get => _symbols;
        set => _symbols = value;
    }
    private RandomStringResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QueryLength.HasValue)
            _length = Math.Clamp(QueryLength.Value, 1, 64);
        if (QueryCount.HasValue)
            _countText = QueryCount.Value.ToString(CultureInfo.InvariantCulture);
        if (QueryLowercase.HasValue)
            _lowercase = QueryLowercase.Value;
        if (QueryUppercase.HasValue)
            _uppercase = QueryUppercase.Value;
        if (QueryNumbers.HasValue)
            _numbers = QueryNumbers.Value;
        if (QuerySymbols.HasValue)
            _symbols = QuerySymbols.Value;
        Generate();
        _queryInitialized = true;
    }

    private void Generate() =>
        _result = RandomNumberTools.GenerateStrings(
            _length,
            int.TryParse(_countText, out var count) ? count : 1,
            _lowercase,
            _uppercase,
            _numbers,
            _symbols
        );
}
