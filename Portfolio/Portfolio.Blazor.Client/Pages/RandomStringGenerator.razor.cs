using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
    private string Action => L["legacy_07c0293b5d88"];
    private string Title => L["legacy_026419b809e7"];
    private string Description => L["legacy_22bf482354bf"];
    private string InputLabel => L["legacy_d9825dc0fc2f"];
    private string LengthLabel => L["legacy_3adb0d7976b8"];
    private string CountLabel => L["legacy_c3c293af9e88"];
    private string LowercaseLabel => L["legacy_5614ce52f619"];
    private string UppercaseLabel => L["legacy_e9280a116a8c"];
    private string NumbersLabel => L["legacy_67b743c4b70b"];
    private string SymbolsLabel => L["legacy_242ec1e1ec73"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string ResultLabel => L["legacy_2f0452494fcb"];
    private string ErrorLabel => L["legacy_6ff4209682b5"];
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
