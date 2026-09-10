using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class MarkdownTableGenerator
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty;
    private string _output = string.Empty;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }
    private string Action => L["legacy_8047a2524a2c"];
    private string Title => L["legacy_83d7aff11839"];
    private string Description => L["legacy_eab8538c5480"];
    private string InputLabel => L["legacy_b26024713364"];
    private string OutputLabel => L["legacy_1d1c0e33dc3c"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string Input
    {
        get => _input;
        set => _input = value;
    }
    private string Output => _output;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? string.Empty;
        _output = Portfolio.Blazor.Core.MarkdownTableGenerator.Generate(_input);
        _queryInitialized = true;
    }

    private void Generate() =>
        _output = Portfolio.Blazor.Core.MarkdownTableGenerator.Generate(_input);
}
