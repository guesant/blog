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
    private string Action => L["legacy_433470930fce"];
    private string Title => L["legacy_a468caa4f7be"];
    private string Description => L["legacy_dfea03ead151"];
    private string InputLabel => L["legacy_194fe11bbba9"];
    private string OptionsLabel => L["legacy_8245de5f962f"];
    private string TrimLabel => L["legacy_683f5dd969a3"];
    private string EmptyRowsLabel => L["legacy_f02ea6353def"];
    private string DuplicateRowsLabel => L["legacy_2bffc6ec40ee"];
    private string SubmitLabel => L["legacy_7ac1691de5eb"];
    private string ResultLabel => L["legacy_23470bef125e"];
    private string ErrorLabel => L["legacy_e4021f92700e"];
    private string RemovedEmptyLabel => L["legacy_6249ecd09030"];
    private string RemovedDuplicateLabel => L["legacy_43dde49957ae"];
    private string DownloadLabel => L["legacy_7df88bb823a8"];
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
