namespace Blog.Blazor.Client.Pages;

public partial class ImageColorPicker
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["image_color_picker_title"];
    private string Description => ToolsL["image_color_picker_lead"];
    private string FileLabel => L["file"];
    private string PickInstruction => L["click_anywhere_on_the_image_to_pick_a_color"];
    private string HexLabel => L["hex_color"];
    private string RgbLabel => L["rgb_color"];
    private string CopyLabel => L["copy"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-color-picker.js");
    }
}
