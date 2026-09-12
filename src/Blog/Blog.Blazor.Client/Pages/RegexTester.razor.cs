using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

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
    private string Action => L["tools_regex_tester"];
    private string Title => ToolsL["regex_tester_title"];
    private string Description => ToolsL["regex_tester_lead"];
    private string PatternLabel => L["regex_pattern"];
    private string TestStringLabel => L["test_string"];
    private string HighlightLabel => L["highlight"];
    private string MatchesLabel => L["matches"];
    private string InvalidLabel => L["invalid_regex_pattern"];
    private string TestLabel => L["testar"];
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
