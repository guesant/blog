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
    private string SpreadsheetId => L["legacy_fd56f560af05"];

    [SupplyParameterFromQuery(Name = "csv")]
    private string? QueryCsv { get; set; }
    private string Action => L["legacy_eb79613910c9"];
    private string Title => ToolsL["table_editor_title"];
    private string Description => ToolsL["table_editor_lead"];
    private string InputLabel => L["legacy_194fe11bbba9"];
    private string TableLabel => L["legacy_614f63ac9e49"];
    private string ApplyLabel => L["legacy_f3b8f813b8fd"];
    private string ExportLabel => L["legacy_8d8bc1d614a0"];
    private string ErrorLabel => L["legacy_9f1bc827bda3"];
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
            L["legacy_7268a45ac707"],
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
