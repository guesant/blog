namespace Blog.Blazor.Client.Pages;

public partial class ImageToBase64
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["image_to_base64_title"];
    private string Description => ToolsL["image_to_base64_lead"];
    private string FileLabel => L["file"];
    private string CharCountLabel => L["character_count"];
    private string ApproxSizeLabel => L["approximate_size"];
    private string OutputLabel => L["output"];
    private string CopyLabel => L["copy"];
    private string CopiedLabel => L["copied"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-to-base64.js");
    }
}
