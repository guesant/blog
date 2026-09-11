namespace Portfolio.Blazor.Client.Pages;

public partial class ImageResizer
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["image_resizer_title"];
    private string Description => ToolsL["image_resizer_lead"];
    private string FileLabel => L["file"];
    private string WidthLabel => L["width"];
    private string HeightLabel => L["height"];
    private string KeepRatioLabel => L["keep_ratio"];
    private string DownloadLabel => L["download"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-resizer.js");
    }
}
