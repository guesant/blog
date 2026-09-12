using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class EnvFileValidator
{
    private string CanonicalPath => RequestPath;
    private string _content = "# example\nAPP_ENV=local\nAPP_DEBUG=true";
    private EnvValidationResult _result = EnvFileValidationEngine.Validate(
        "# example\nAPP_ENV=local\nAPP_DEBUG=true"
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "content")]
    private string? QueryContent { get; set; }
    private string Action => L["tools_env_file_validator"];
    private string Title => ToolsL["env_file_validator_title"];
    private string Description => ToolsL["env_file_validator_lead"];
    private string InputLabel => L["input"];
    private string IssuesLabel => L["problemas"];
    private string NoIssuesLabel => L["no_issues_found"];
    private string EntriesLabel => L["valid_entries"];
    private string LineLabel => L["line"];
    private string ValidateLabel => L["validate"];
    private string Content
    {
        get => _content;
        set
        {
            _content = value;
            _result = EnvFileValidationEngine.Validate(value);
        }
    }
    private EnvValidationResult Result => _result;

    private string IssueMessage(EnvIssue issue) =>
        issue.Kind switch
        {
            "duplicate" => $"{(L["duplicate_key"])}: {issue.Key}",
            "invalid-key" => $"{(L["invalid_key"])}: {issue.Key}",
            _ => L["malformed_line"],
        };

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _content = QueryContent ?? _content;
        _result = EnvFileValidationEngine.Validate(_content);
        _queryInitialized = true;
    }
}
