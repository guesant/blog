namespace Blog.Blazor.Client.Pages;

public partial class ColorblindnessSimulator
{
    private string CanonicalPath => RequestPath;
    private string Title => ToolsL["colorblindness_simulator_title"];
    private string Description => ToolsL["colorblindness_simulator_lead"];
    private string FileLabel => L["file"];
    private string OriginalLabel => L["original"];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/colorblindness-simulator.js");
    }
}
