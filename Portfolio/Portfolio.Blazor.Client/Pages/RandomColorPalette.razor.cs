using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class RandomColorPalette
{
    private string CanonicalPath => RequestPath;
    private string _countText = "5";
    private bool _queryInitialized;
    private ColorPaletteResult _result = RandomNumberTools.GenerateColorPalette(5);

    [SupplyParameterFromQuery(Name = "count")]
    private int? QueryCount { get; set; }
    private string Action => L["legacy_1b6ab2171a36"];
    private string Title => ToolsL["random_color_palette_page_title"];
    private string Description => ToolsL["random_color_palette_lead"];
    private string InputLabel => L["legacy_d9825dc0fc2f"];
    private string CountLabel => L["legacy_ef308c5310a6"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string CopyAllLabel => L["legacy_8061dcef46fa"];
    private string ResultLabel => L["legacy_2f0452494fcb"];
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
