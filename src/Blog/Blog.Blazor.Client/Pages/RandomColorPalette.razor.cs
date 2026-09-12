using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class RandomColorPalette
{
    private string CanonicalPath => RequestPath;
    private string _countText = "5";
    private bool _queryInitialized;
    private ColorPaletteResult _result = RandomNumberTools.GenerateColorPalette(5);

    [SupplyParameterFromQuery(Name = "count")]
    private int? QueryCount { get; set; }
    private string Action => L["tools_random_color_palette"];
    private string Title => ToolsL["random_color_palette_page_title"];
    private string Description => ToolsL["random_color_palette_lead"];
    private string InputLabel => L["parameters"];
    private string CountLabel => L["how_many_colors"];
    private string GenerateLabel => L["generate"];
    private string CopyLabel => L["copy"];
    private string CopyAllLabel => L["copy_all_colors"];
    private string ResultLabel => L["results"];
    private string CountText
    {
        get => _countText;
        set => _countText = value;
    }
    private ColorPaletteResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QueryCount.HasValue)
            _countText = QueryCount.Value.ToString(CultureInfo.InvariantCulture);
        Generate();
        _queryInitialized = true;
    }

    private void Generate() =>
        _result = RandomNumberTools.GenerateColorPalette(
            int.TryParse(_countText, out var count) ? count : 5
        );

    private async Task CopyAsync(string value) =>
        await JS.InvokeVoidAsync("navigator.clipboard.writeText", value);

    private async Task CopyAllAsync() =>
        await JS.InvokeVoidAsync("navigator.clipboard.writeText", string.Join("\n", Result.Values));
}
