namespace Portfolio.Blazor.Client.Pages;

public partial class SvgToPng
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["svg_to_png_title"];
    private string Description => ToolsL["svg_to_png_lead"];
    private string SvgFileLabel => L["svg_file"];
    private string SvgInputLabel => L["markup_svg"];
    private string WidthLabel => L["width"];
    private string HeightLabel => L["height"];
    private string RenderLabel => L["render"];
    private string InvalidLabel => L["could_not_render_this_svg"];
    private string DownloadLabel => L["download"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/svg-to-png.js");
    }
}
