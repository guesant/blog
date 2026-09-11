using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class UuidGenerator
{
    private string CanonicalPath => RequestPath;
    private string _countText = "1";
    private bool _queryInitialized;
    private IReadOnlyList<string> _result = RandomNumberTools.GenerateUuids(1);

    [SupplyParameterFromQuery(Name = "count")]
    private int? QueryCount { get; set; }
    private string Action => L["tools_uuid_generator"];
    private string Title => ToolsL["uuid_generator_page_title"];
    private string Description => ToolsL["uuid_generator_lead"];
    private string InputLabel => L["parameters"];
    private string CountLabel => L["how_many"];
    private string GenerateLabel => L["generate"];
    private string CopyLabel => L["copy"];
    private string CopyAllLabel => L["copy_all"];
    private string ResultLabel => L["results"];
    private string CountText
    {
        get => _countText;
        set => _countText = value;
    }
    private IReadOnlyList<string> Result => _result;

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
        _result = RandomNumberTools.GenerateUuids(
            int.TryParse(_countText, out var count) ? count : 1
        );

    private async Task CopyAsync(string value) =>
        await JS.InvokeVoidAsync("navigator.clipboard.writeText", value);

    private async Task CopyAllAsync() =>
        await JS.InvokeVoidAsync("navigator.clipboard.writeText", string.Join("\n", Result));
}
