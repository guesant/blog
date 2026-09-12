namespace Blog.Blazor.Client.Pages;

public partial class ImageCompressor
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["image_compressor_title"];
    private string Description => ToolsL["image_compressor_lead"];
    private string FileLabel => L["file"];
    private string FormatLabel => L["format"];
    private static string JpegLabel => "JPEG";
    private static string WebpLabel => "WebP";
    private string QualityLabel => L["quality"];
    private string OriginalSizeLabel => L["original_size"];
    private string CompressedSizeLabel => L["compressed_size"];
    private string ReductionLabel => L["reduction"];
    private string DownloadLabel => L["download"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-compressor.js");
    }
}
