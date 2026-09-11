using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class PasswordGenerator
{
    private string CanonicalPath => RequestPath;
    private int _length = 16;
    private bool _uppercase = true,
        _lowercase = true,
        _numbers = true,
        _symbols = true,
        _queryInitialized;
    private PasswordResult _result = RandomNumberTools.GeneratePassword(16, true, true, true, true);

    [SupplyParameterFromQuery(Name = "length")]
    private int? QueryLength { get; set; }

    [SupplyParameterFromQuery(Name = "uppercase")]
    private bool? QueryUppercase { get; set; }

    [SupplyParameterFromQuery(Name = "lowercase")]
    private bool? QueryLowercase { get; set; }

    [SupplyParameterFromQuery(Name = "numbers")]
    private bool? QueryNumbers { get; set; }

    [SupplyParameterFromQuery(Name = "symbols")]
    private bool? QuerySymbols { get; set; }
    private string Action => L["legacy_1d1595df3e88"];
    private string Title => ToolsL["password_generator_page_title"];
    private string Description => ToolsL["password_generator_lead"];
    private string InputLabel => L["legacy_d9825dc0fc2f"];
    private string LengthLabel => L["legacy_3adb0d7976b8"];
    private string UppercaseLabel => L["legacy_e9280a116a8c"];
    private string LowercaseLabel => L["legacy_5614ce52f619"];
    private string NumbersLabel => L["legacy_67b743c4b70b"];
    private string SymbolsLabel => L["legacy_242ec1e1ec73"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string OutputLabel => L["legacy_43de9a92be0e"];
    private string StrengthLabel => L["legacy_59f4fd8868f2"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private int Length
    {
        get => _length;
        set
        {
            _length = Math.Clamp(value, 8, 64);
            Generate();
        }
    }
    private bool Uppercase
    {
        get => _uppercase;
        set
        {
            _uppercase = value;
            Generate();
        }
    }
    private bool Lowercase
    {
        get => _lowercase;
        set
        {
            _lowercase = value;
            Generate();
        }
    }
    private bool Numbers
    {
        get => _numbers;
        set
        {
            _numbers = value;
            Generate();
        }
    }
    private bool Symbols
    {
        get => _symbols;
        set
        {
            _symbols = value;
            Generate();
        }
    }
    private PasswordResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QueryLength.HasValue)
            _length = Math.Clamp(QueryLength.Value, 8, 64);
        if (QueryUppercase.HasValue)
            _uppercase = QueryUppercase.Value;
        if (QueryLowercase.HasValue)
            _lowercase = QueryLowercase.Value;
        if (QueryNumbers.HasValue)
            _numbers = QueryNumbers.Value;
        if (QuerySymbols.HasValue)
            _symbols = QuerySymbols.Value;
        Generate();
        _queryInitialized = true;
    }

    private void Generate() =>
        _result = RandomNumberTools.GeneratePassword(
            _length,
            _uppercase,
            _lowercase,
            _numbers,
            _symbols
        );
}
