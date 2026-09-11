using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class QueryStringParser
{
    private string CanonicalPath => RequestPath;
    private string _parseInput = "https://example.com/path?foo=bar&baz=qux";
    private bool _queryInitialized;
    private List<QueryParameterRow> _rows = [new()];
    private QueryStringParseResult _parsed = QueryStringTools.Parse(
        "https://example.com/path?foo=bar&baz=qux"
    );

    [SupplyParameterFromQuery(Name = "query")]
    private string? Query { get; set; }
    private string Action => L["tools_query_string_parser"];
    private string Title => ToolsL["query_string_parser_title"];
    private string Description => ToolsL["query_string_parser_lead"];
    private string ParseLabel => L["parse"];
    private string BuildLabel => L["build"];
    private string OutputLabel => L["query_string"];
    private string KeyPlaceholder => L["key"];
    private string ValuePlaceholder => L["value"];
    private string AddLabel => L["add_row"];
    private string RemoveLabel => L["remove_row"];
    private string ParseInput
    {
        get => _parseInput;
        set
        {
            _parseInput = value;
            _parsed = QueryStringTools.Parse(value);
        }
    }
    private QueryStringParseResult Parsed => _parsed;
    private IReadOnlyList<QueryParameterRow> Rows => _rows;
    private string BuiltQuery =>
        QueryStringTools.Build(_rows.Select(row => new QueryParameter(row.Key, row.Value)));

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _parseInput = Query ?? _parseInput;
        _parsed = QueryStringTools.Parse(_parseInput);
        _queryInitialized = true;
    }

    private void AddRow() => _rows.Add(new());

    private void RemoveRow(QueryParameterRow row)
    {
        if (_rows.Count > 1)
            _rows.Remove(row);
    }

    private static void UpdateKey(QueryParameterRow row, ChangeEventArgs args)
    {
        row.Key = args.Value?.ToString() ?? "";
    }

    private static void UpdateValue(QueryParameterRow row, ChangeEventArgs args)
    {
        row.Value = args.Value?.ToString() ?? "";
    }

    private sealed class QueryParameterRow
    {
        public string Key { get; set; } = "";
        public string Value { get; set; } = "";
    }
}
