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
    private string Action => L["legacy_5e4145127e27"];
    private string Title => ToolsL["query_string_parser_title"];
    private string Description => ToolsL["query_string_parser_lead"];
    private string ParseLabel => L["legacy_1922ada5500a"];
    private string BuildLabel => L["legacy_488880914467"];
    private string OutputLabel => L["legacy_62f929d726c5"];
    private string KeyPlaceholder => L["legacy_5fd1ae1806c0"];
    private string ValuePlaceholder => L["legacy_30206ddec692"];
    private string AddLabel => L["legacy_06a54336a405"];
    private string RemoveLabel => L["legacy_3821b4e4a602"];
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
