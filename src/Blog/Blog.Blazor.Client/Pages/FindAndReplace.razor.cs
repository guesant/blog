using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class FindAndReplace
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty,
        _find = string.Empty,
        _replacement = string.Empty;
    private bool _caseSensitive,
        _useRegex,
        _queryInitialized;
    private FindReplaceResult _result = FindAndReplaceEngine.Execute(
        string.Empty,
        string.Empty,
        string.Empty,
        false,
        false
    );

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }

    [SupplyParameterFromQuery(Name = "find")]
    private string? QueryFind { get; set; }

    [SupplyParameterFromQuery(Name = "replacement")]
    private string? QueryReplacement { get; set; }

    [SupplyParameterFromQuery(Name = "caseSensitive")]
    private bool? QueryCaseSensitive { get; set; }

    [SupplyParameterFromQuery(Name = "useRegex")]
    private bool? QueryUseRegex { get; set; }
    private string Action => L["tools_find_and_replace"];
    private string Title => ToolsL["find_and_replace_title"];
    private string Description => ToolsL["find_and_replace_lead"];
    private string InputLabel => L["input"];
    private string FindLabel => L["find"];
    private string ReplaceLabel => L["replace_with"];
    private string CaseSensitiveLabel => L["case_sensitive"];
    private string UseRegexLabel => L["use_regex"];
    private string ReplaceButtonLabel => L["replace"];
    private string InvalidRegexLabel => L["invalid_regular_expression"];
    private string OutputLabel => L["output"];
    private string CopyLabel => L["copy"];
    private string Input
    {
        get => _input;
        set => _input = value;
    }
    private string Find
    {
        get => _find;
        set => _find = value;
    }
    private string Replacement
    {
        get => _replacement;
        set => _replacement = value;
    }
    private bool CaseSensitive
    {
        get => _caseSensitive;
        set => _caseSensitive = value;
    }
    private bool UseRegex
    {
        get => _useRegex;
        set => _useRegex = value;
    }
    private FindReplaceResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? _input;
        _find = QueryFind ?? _find;
        _replacement = QueryReplacement ?? _replacement;
        _caseSensitive = QueryCaseSensitive ?? _caseSensitive;
        _useRegex = QueryUseRegex ?? _useRegex;
        _result = FindAndReplaceEngine.Execute(
            _input,
            _find,
            _replacement,
            _caseSensitive,
            _useRegex
        );
        _queryInitialized = true;
    }

    private void Replace() =>
        _result = FindAndReplaceEngine.Execute(
            _input,
            _find,
            _replacement,
            _caseSensitive,
            _useRegex
        );

    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    private void DebounceReplace() =>
        _debouncer.Trigger(() =>
        {
            Replace();
            StateHasChanged();
        });

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
