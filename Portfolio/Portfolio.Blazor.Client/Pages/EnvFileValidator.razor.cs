using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
    private string Action => L["legacy_2d6f58ba4827"];
    private string Title => L["legacy_a1b71a322a5c"];
    private string Description => L["legacy_b2ac648cd042"];
    private string InputLabel => L["legacy_c4c61716670f"];
    private string IssuesLabel => L["legacy_6bbce1ac767e"];
    private string NoIssuesLabel => L["legacy_ce032fa503a7"];
    private string EntriesLabel => L["legacy_7415a41dc0f9"];
    private string LineLabel => L["legacy_3dcd15b72733"];
    private string ValidateLabel => L["legacy_3fcad41c9c0d"];
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
            "duplicate" => $"{(L["legacy_5d92aac4b2d4"])}: {issue.Key}",
            "invalid-key" => $"{(L["legacy_ca8bac6ad8c0"])}: {issue.Key}",
            _ => L["legacy_ef9f0c08caa5"],
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
