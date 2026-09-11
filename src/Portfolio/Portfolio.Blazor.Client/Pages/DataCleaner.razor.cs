using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class DataCleaner
{
    private string CanonicalPath => RequestPath;
    private const string DefaultCsv = "name, value\n alpha, 10\n\n beta, 20\n beta, 20";
    private string _csvText = DefaultCsv;
    private bool _trimCells = true;
    private bool _removeEmptyRows = true;
    private bool _removeDuplicateRows = true;
    private DataCleanerResult _result = Portfolio.Blazor.Core.DataCleaner.Clean(
        DefaultCsv,
        true,
        true,
        true
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "csv")]
    private string? QueryCsv { get; set; }

    [SupplyParameterFromQuery(Name = "trim")]
    private string? QueryTrim { get; set; }

    [SupplyParameterFromQuery(Name = "empty")]
    private string? QueryEmpty { get; set; }

    [SupplyParameterFromQuery(Name = "duplicates")]
    private string? QueryDuplicates { get; set; }
    private string Action => L["tools_data_cleaner"];
    private string Title => ToolsL["data_cleaner_title"];
    private string Description => ToolsL["data_cleaner_lead"];
    private string InputLabel => L["input_csv"];
    private string OptionsLabel => L["cleaning_options"];
    private string TrimLabel => L["trim_cell_whitespace"];
    private string EmptyRowsLabel => L["remove_empty_rows"];
    private string DuplicateRowsLabel => L["remove_duplicate_rows"];
    private string SubmitLabel => L["clean_data"];
    private string ResultLabel => L["result"];
    private string ErrorLabel => L["provide_csv_within_the_allowed_limit"];
    private string RemovedEmptyLabel => L["empty_removed"];
    private string RemovedDuplicateLabel => L["duplicates_removed"];
    private string DownloadLabel => L["download_csv"];
    private string CsvText
    {
        get => _csvText;
        set
        {
            _csvText = value;
            if (RendererInfo.IsInteractive)
                Recalculate();
        }
    }
    private bool TrimCells
    {
        get => _trimCells;
        set
        {
            _trimCells = value;
            if (RendererInfo.IsInteractive)
                Recalculate();
        }
    }
    private bool RemoveEmptyRows
    {
        get => _removeEmptyRows;
        set
        {
            _removeEmptyRows = value;
            if (RendererInfo.IsInteractive)
                Recalculate();
        }
    }
    private bool RemoveDuplicateRows
    {
        get => _removeDuplicateRows;
        set
        {
            _removeDuplicateRows = value;
            if (RendererInfo.IsInteractive)
                Recalculate();
        }
    }
    private DataCleanerResult Result => _result;
    private string DownloadUrl =>
        $"data:text/csv;charset=utf-8,{Uri.EscapeDataString(Result.Output)}";

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _csvText = QueryCsv ?? _csvText;
        _trimCells = ParseFlag(QueryTrim, _trimCells);
        _removeEmptyRows = ParseFlag(QueryEmpty, _removeEmptyRows);
        _removeDuplicateRows = ParseFlag(QueryDuplicates, _removeDuplicateRows);
        Recalculate();
        _queryInitialized = true;
    }

    private void Recalculate() =>
        _result = Portfolio.Blazor.Core.DataCleaner.Clean(
            _csvText,
            _trimCells,
            _removeEmptyRows,
            _removeDuplicateRows
        );

    private static bool ParseFlag(string? value, bool fallback) =>
        value is null ? fallback : value is "true" or "1" or "on";
}
