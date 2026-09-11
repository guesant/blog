using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class QrCodeGenerator
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }
    private string Action => L["legacy_d6f37f5d3529"];
    private string Title => ToolsL["qr_code_generator_page_title"];
    private string Description => ToolsL["qr_code_generator_lead"];
    private string InputLabel => L["legacy_b5fe689222ce"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string DownloadLabel => L["legacy_c36a12636bbd"];
    private string InvalidLabel => L["legacy_93577aecb1ab"];
    private string Input
    {
        get => _input;
        set => _input = value;
    }
    private QrCodeResult Result => QrCodeGeneratorEngine.Generate(Input);
    private string DownloadHref =>
        $"data:image/svg+xml;charset=utf-8,{Uri.EscapeDataString(Result.Svg)}";

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? string.Empty;
        _queryInitialized = true;
    }

    private async Task DownloadAsync()
    {
        if (Result.IsValid)
            await JS.InvokeVoidAsync("qrCodeGenerator.download", Result.Svg);
    }
}
