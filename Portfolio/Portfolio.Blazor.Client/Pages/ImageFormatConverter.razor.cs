namespace Portfolio.Blazor.Client.Pages;

public partial class ImageFormatConverter
{
    private string CanonicalPath => RequestPath;
    private string Title => L["legacy_240cb13abc78"];
    private string Description => L["legacy_7e993ad7473a"];
    private string FileLabel => L["legacy_6320d8841a37"];
    private string FormatLabel => L["legacy_e0dd9214dd3f"];
    private string DownloadLabel => L["legacy_c36a12636bbd"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-format-converter.js");
    }
}
