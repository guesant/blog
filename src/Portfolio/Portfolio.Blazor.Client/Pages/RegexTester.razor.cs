using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class RegexTester
{
    private string CanonicalPath => RequestPath;
    private string _pattern = string.Empty;
    private string _input = string.Empty;
    private bool _global = true;
    private bool _ignoreCase;
    private bool _multiline;
    private bool _singleline;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "pattern")]
    private string? QueryPattern { get; set; }

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }
    private string Action => L["legacy_312eb91d9fd3"];
    private string Title => ToolsL["regex_tester_title"];
    private string Description => ToolsL["regex_tester_lead"];
    private string PatternLabel => L["legacy_5e995a75d37b"];
    private string TestStringLabel => L["legacy_7e40ce38ac57"];
    private string HighlightLabel => L["legacy_b93f00c414ef"];
    private string MatchesLabel => L["legacy_7de298425b05"];
    private string InvalidLabel => L["legacy_e5d2fa50a2dd"];
    private string TestLabel => L["legacy_ff9e12d2239d"];
    private static string GlobalLabel => "g";
    private static string IgnoreCaseLabel => "i";
    private static string MultilineLabel => "m";
    private static string SinglelineLabel => "s";
    private string Pattern
    {
        get => _pattern;
        set => _pattern = value;
    }
    private string Input
    {
        get => _input;
        set => _input = value;
    }
    private bool Global
    {
        get => _global;
        set => _global = value;
    }
    private bool IgnoreCase
    {
        get => _ignoreCase;
        set => _ignoreCase = value;
    }
    private bool Multiline
    {
        get => _multiline;
        set => _multiline = value;
    }
    private bool Singleline
    {
        get => _singleline;
        set => _singleline = value;
    }
    private RegexTestResult Result =>
        RegexTesterEngine.Test(Pattern, Input, IgnoreCase, Multiline, Singleline);

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _pattern = QueryPattern ?? string.Empty;
        _input = QueryInput ?? string.Empty;
        _queryInitialized = true;
    }
}
