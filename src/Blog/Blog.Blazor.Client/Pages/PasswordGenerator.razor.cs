using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

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
    private string Action => L["tools_password_generator"];
    private string Title => ToolsL["password_generator_page_title"];
    private string Description => ToolsL["password_generator_lead"];
    private string InputLabel => L["parameters"];
    private string LengthLabel => L["length"];
    private string UppercaseLabel => L["uppercase"];
    private string LowercaseLabel => L["lowercase"];
    private string NumbersLabel => L["numbers"];
    private string SymbolsLabel => L["symbols"];
    private string GenerateLabel => L["generate"];
    private string OutputLabel => L["password"];
    private string StrengthLabel => L["estimated_entropy_bits"];
    private string CopyLabel => L["copy"];
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
