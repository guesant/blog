namespace Portfolio.Blazor.Client.Pages;

public partial class ImageToBase64
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["image_to_base64_title"];
    private string Description => ToolsL["image_to_base64_lead"];
    private string FileLabel => L["legacy_6320d8841a37"];
    private string CharCountLabel => L["legacy_825058327466"];
    private string ApproxSizeLabel => L["legacy_99db525d460f"];
    private string OutputLabel => L["legacy_1d1c0e33dc3c"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string CopiedLabel => L["legacy_7098c22fccd8"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-to-base64.js");
    }
}
