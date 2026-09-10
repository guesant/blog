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
    private string Action => L["legacy_22d7b9c91ac1"];
    private string Title => L["legacy_7ed6e1cc0167"];
    private string Description => L["legacy_b2a8500d56e0"];
    private string InputLabel => L["legacy_c4c61716670f"];
    private string ResultLabel => L["legacy_2f0452494fcb"];
    private string CalculateLabel => L["legacy_53519f340509"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string Md5Note => L["legacy_a2ec678f7171"];
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
