namespace Portfolio.Blazor.Client.Pages;

public partial class ColorblindnessSimulator
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["colorblindness_simulator_title"];
    private string Description => ToolsL["colorblindness_simulator_lead"];
    private string FileLabel => L["legacy_9bef2683c82f"];
    private string OriginalLabel => L["legacy_c2d60a6a09e7"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/colorblindness-simulator.js");
    }
}
