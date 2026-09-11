using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class DataConverters
{
    private string CanonicalPath => RequestPath;
    private string _input = "[{\"name\":\"alpha\",\"value\":10},{\"name\":\"beta\",\"value\":20}]";
    private DataConverterResult _result = DataConverter.JsonToCsv(
        "[{\"name\":\"alpha\",\"value\":10},{\"name\":\"beta\",\"value\":20}]"
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "json")]
    private string? QueryJson { get; set; }
    private bool IsJsonToCsv =>
        Navigation.Uri.Contains("/json-to-csv", StringComparison.OrdinalIgnoreCase);
    private string Action =>
        LocalizedUrls.Current($"/tools/{(IsJsonToCsv ? "json-to-csv" : "json-formatter")}");
    private string Title =>
        IsJsonToCsv ? (ToolsL["json_to_csv_title"]) : (ToolsL["json_formatter_title"]);
    private string Description =>
        IsJsonToCsv ? (ToolsL["json_to_csv_lead"]) : (ToolsL["json_formatter_lead"]);
    private string InputLabel => L["legacy_9273dd785105"];
    private string OutputLabel => L["legacy_f2a7eb87e63d"];
    private string SubmitLabel =>
        IsJsonToCsv ? (L["legacy_ae125407093e"]) : (L["legacy_1593ad5197b9"]);
    private string ErrorLabel =>
        IsJsonToCsv ? (L["legacy_542fcc3fa57f"]) : (L["legacy_60b04b590d85"]);
    private string Input
    {
        get => _input;
        set
        {
            _input = value;
            Recalculate();
        }
    }
    private DataConverterResult Result => _result;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _input = QueryJson ?? _input;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate() =>
        _result = IsJsonToCsv ? DataConverter.JsonToCsv(_input) : DataConverter.FormatJson(_input);
}
