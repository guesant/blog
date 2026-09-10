namespace Portfolio.Blazor.Client.Pages;

public partial class ImageColorPicker
{
    private string CanonicalPath => RequestPath;
    private string Title => L["legacy_6ecce5263eaf"];
    private string Description => L["legacy_096adcee620d"];
    private string FileLabel => L["legacy_6320d8841a37"];
    private string PickInstruction => L["legacy_a85bb5f5097f"];
    private string HexLabel => L["legacy_e2e0c29e18f9"];
    private string RgbLabel => L["legacy_480903cafe5b"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/image-color-picker.js");
    }
}
