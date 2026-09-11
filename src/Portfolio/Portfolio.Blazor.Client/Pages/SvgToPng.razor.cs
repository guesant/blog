namespace Portfolio.Blazor.Client.Pages;

public partial class SvgToPng
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["svg_to_png_title"];
    private string Description => ToolsL["svg_to_png_lead"];
    private string SvgFileLabel => L["legacy_1fc0c7906bc3"];
    private string SvgInputLabel => L["legacy_18558a4774c7"];
    private string WidthLabel => L["legacy_d62fe4abf513"];
    private string HeightLabel => L["legacy_13d945a301ce"];
    private string RenderLabel => L["legacy_5f2eecff206c"];
    private string InvalidLabel => L["legacy_bd405515bc77"];
    private string DownloadLabel => L["legacy_c36a12636bbd"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/svg-to-png.js");
    }
}
