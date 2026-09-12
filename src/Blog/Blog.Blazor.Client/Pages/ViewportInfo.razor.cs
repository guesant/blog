namespace Blog.Blazor.Client.Pages;

public partial class ViewportInfo
{
    private string CanonicalPath => RequestPath;
    private ViewportSnapshot Info = new();
    private IJSObjectReference? Module;
    private string Title => ToolsL["viewport_info_page_title"];
    private string Description => ToolsL["viewport_info_lead"];
    private string ViewportWidthLabel => L["viewport_width"];
    private string ViewportHeightLabel => L["viewport_height"];
    private string ScreenWidthLabel => L["screen_width"];
    private string ScreenHeightLabel => L["screen_height"];
    private string PixelRatioLabel => L["pixel_ratio"];
    private string ColorDepthLabel => L["color_depth"];
    private string LanguageLabel => L["language"];
    private string LanguagesLabel => L["languages"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender || !RendererInfo.IsInteractive)
            return;
        Module = await JS.InvokeAsync<IJSObjectReference>("import", "/browser-metadata.js");
        Info = await Module.InvokeAsync<ViewportSnapshot>("getViewport");
        StateHasChanged();
    }

    public async ValueTask DisposeAsync()
    {
        if (Module is not null)
            await Module.DisposeAsync();
    }

    private sealed class ViewportSnapshot
    {
        public int ViewportWidth { get; set; }
        public int ViewportHeight { get; set; }
        public int ScreenWidth { get; set; }
        public int ScreenHeight { get; set; }
        public double PixelRatio { get; set; }
        public int ColorDepth { get; set; }
        public string Language { get; set; } = "-";
        public string Languages { get; set; } = "-";
    }
}
