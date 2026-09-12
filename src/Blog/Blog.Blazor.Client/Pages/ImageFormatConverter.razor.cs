namespace Blog.Blazor.Client.Pages;

public partial class ImageFormatConverter
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["image_format_converter_title"];
    private string Description => ToolsL["image_format_converter_lead"];
    private string FileLabel => L["file"];
    private string FormatLabel => L["format"];
    private string DownloadLabel => L["download"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-format-converter.js");
    }
}
