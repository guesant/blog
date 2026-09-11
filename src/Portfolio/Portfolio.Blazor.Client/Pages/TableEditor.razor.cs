using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class TableEditor
{
    private string CanonicalPath => RequestPath;
    private const string DefaultCsv = "name,value\nalpha,10\nbeta,20\ngamma,15";
    private string _csvText = DefaultCsv;
    private List<List<string>> _rows = [];
    private bool _queryInitialized;
    private bool _spreadsheetPending;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));
    private string SpreadsheetId => L["table_editor_spreadsheet_pt"];

    [SupplyParameterFromQuery(Name = "csv")]
    private string? QueryCsv { get; set; }
    private string Action => L["tools_table_editor"];
    private string Title => ToolsL["table_editor_title"];
    private string Description => ToolsL["table_editor_lead"];
    private string InputLabel => L["input_csv"];
    private string TableLabel => L["editable_table"];
    private string ApplyLabel => L["load_table"];
    private string ExportLabel => L["export_csv"];
    private string ErrorLabel => L["the_csv_exceeds_the_allowed_limits"];
    private List<List<string>> Rows => _rows;
    private string CsvText
    {
        get => _csvText;
        set
        {
            _csvText = value;
            if (RendererInfo.IsInteractive)
                _debouncer.Trigger(() =>
                {
                    ParseInput();
                    StateHasChanged();
                });
        }
    }
    private string CsvDownloadUrl =>
        $"data:text/csv;charset=utf-8,{Uri.EscapeDataString(CsvTable.Serialize(Rows))}";

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _csvText = QueryCsv ?? _csvText;
            ParseInput();
            _queryInitialized = true;
        }
    }

    private void ParseInput()
    {
        _rows = CsvTable.Parse(_csvText).Select(row => row.ToList()).ToList();
        _spreadsheetPending = true;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (RendererInfo.IsInteractive && _spreadsheetPending && Rows.Count > 0)
        {
            _spreadsheetPending = false;
            await JS.InvokeVoidAsync(
                "tableEditor.initialize",
                SpreadsheetId,
                Rows[0],
                Rows.Skip(1)
            );
        }
    }

    private async Task ExportSpreadsheet()
    {
        if (!RendererInfo.IsInteractive || Rows.Count == 0)
            return;
        await JS.InvokeVoidAsync(
            "tableEditor.downloadCsv",
            SpreadsheetId,
            L["table_csv"],
            Rows[0],
            ExportLabel
        );
    }

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
