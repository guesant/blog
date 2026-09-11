using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class QrCodeGenerator
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }
    private string Action => L["tools_qr_code_generator"];
    private string Title => ToolsL["qr_code_generator_page_title"];
    private string Description => ToolsL["qr_code_generator_lead"];
    private string InputLabel => L["text_or_url"];
    private string GenerateLabel => L["generate"];
    private string DownloadLabel => L["download"];
    private string InvalidLabel => L["invalid_content_for_qr_code_generation"];
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
