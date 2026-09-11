namespace Portfolio.Blazor.Client.Pages;

public partial class ImageCompressor
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["image_compressor_title"];
    private string Description => ToolsL["image_compressor_lead"];
    private string FileLabel => L["legacy_6320d8841a37"];
    private string FormatLabel => L["legacy_e0dd9214dd3f"];
    private static string JpegLabel => "JPEG";
    private static string WebpLabel => "WebP";
    private string QualityLabel => L["legacy_af8853818301"];
    private string OriginalSizeLabel => L["legacy_ad7018d0174f"];
    private string CompressedSizeLabel => L["legacy_265bf169dfcb"];
    private string ReductionLabel => L["legacy_b9343b30c140"];
    private string DownloadLabel => L["legacy_c36a12636bbd"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-compressor.js");
    }
}
