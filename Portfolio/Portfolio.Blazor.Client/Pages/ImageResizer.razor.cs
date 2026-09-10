namespace Portfolio.Blazor.Client.Pages;

public partial class ImageResizer
{
    private string CanonicalPath => RequestPath;
    private string Title => L["legacy_ad87a29a6f4b"];
    private string Description => L["legacy_69fe66124643"];
    private string FileLabel => L["legacy_6320d8841a37"];
    private string WidthLabel => L["legacy_d62fe4abf513"];
    private string HeightLabel => L["legacy_13d945a301ce"];
    private string KeepRatioLabel => L["legacy_2dbc91a80289"];
    private string DownloadLabel => L["legacy_c36a12636bbd"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-resizer.js");
    }
}
