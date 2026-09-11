using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class HashGenerator
{
    private string CanonicalPath => RequestPath;
    private string _input = "";
    private bool _queryInitialized;
    private HashResult _result = HashTools.Calculate("");

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }
    private string Action => L["tools_hash_generator"];
    private string Title => ToolsL["hash_generator_page_title"];
    private string Description => ToolsL["hash_generator_lead"];
    private string InputLabel => L["input"];
    private string ResultLabel => L["results"];
    private string CalculateLabel => L["calculate"];
    private string CopyLabel => L["copy"];
    private string Md5Note => L["md5_is_not_offered_here_this_tool_provides_only"];
    private string Input
    {
        get => _input;
        set
        {
            _input = value;
            Recalculate();
        }
    }
    private HashResult Result => _result;
    private IEnumerable<(string Id, string Label, string Value)> Hashes =>
        [
            ("hash-sha1", "SHA-1", Result.Sha1),
            ("hash-sha256", "SHA-256", Result.Sha256),
            ("hash-sha384", "SHA-384", Result.Sha384),
            ("hash-sha512", "SHA-512", Result.Sha512),
        ];

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? _input;
        Recalculate();
        _queryInitialized = true;
    }

    private void Recalculate() => _result = HashTools.Calculate(_input);
}
