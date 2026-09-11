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
    private string InputLabel => L["input_json"];
    private string OutputLabel => L["result_label"];
    private string SubmitLabel => IsJsonToCsv ? (L["converter"]) : (L["format_action"]);
    private string ErrorLabel =>
        IsJsonToCsv ? (L["use_a_json_array_containing_objects_only"]) : (L["provide_valid_json"]);
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
