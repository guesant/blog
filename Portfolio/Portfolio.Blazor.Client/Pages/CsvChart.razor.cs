using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class CsvChart
{
    private string CanonicalPath => RequestPath;
    private const string DefaultCsv = "time,value\n0,10\n1,20\n2,15";
    private string _csvText = DefaultCsv;
    private string _delimiterText = "auto";
    private string _chartTypeText = "line";
    private string _xIndexText = "0";
    private string _yIndexText = "1";
    private string _filterText = string.Empty;
    private CsvParsedTable _table = CsvChartCalculator.ParseTable(DefaultCsv);
    private CsvChartResult _result = CsvChartCalculator.Analyze(DefaultCsv);
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "csv")]
    private string? QueryCsv { get; set; }

    [SupplyParameterFromQuery(Name = "delimiter")]
    private string? QueryDelimiter { get; set; }

    [SupplyParameterFromQuery(Name = "type")]
    private string? QueryType { get; set; }

    [SupplyParameterFromQuery(Name = "x")]
    private string? QueryX { get; set; }

    [SupplyParameterFromQuery(Name = "y")]
    private string? QueryY { get; set; }

    [SupplyParameterFromQuery(Name = "filter")]
    private string? QueryFilter { get; set; }
    private string Action => L["legacy_024205604324"];
    private string Title => L["legacy_010d95aefc52"];
    private string Description => L["csv_chart_full_description"];
    private string InputLabel => L["legacy_2cb19719b24a"];
    private string SubmitLabel => L["legacy_cf6c94423239"];
    private string ErrorLabel => L["legacy_e575de76e132"];
    private string DelimiterLabel => L["csv_chart_delimiter_label"];
    private string ChartTypeLabel => L["csv_chart_type_label"];
    private string XLabel => L["csv_chart_x_label"];
    private string YLabel => L["csv_chart_y_label"];
    private string FilterLabel => L["csv_chart_filter_label"];
    private string TableLabel => L["csv_chart_table_label"];
    private string ExportPngLabel => L["csv_chart_export_png"];
    private string CsvText
    {
        get => _csvText;
        set
        {
            _csvText =
                value.Length > CsvTable.MaximumCharacters
                    ? value[..CsvTable.MaximumCharacters]
                    : value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string DelimiterText
    {
        get => _delimiterText;
        set
        {
            _delimiterText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string ChartTypeText
    {
        get => _chartTypeText;
        set
        {
            _chartTypeText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string XIndexText
    {
        get => _xIndexText;
        set
        {
            _xIndexText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string YIndexText
    {
        get => _yIndexText;
        set
        {
            _yIndexText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string FilterText
    {
        get => _filterText;
        set
        {
            _filterText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private CsvChartResult Result => _result;

    private IReadOnlyList<SiteSelectOption> DelimiterOptions =>
        [
            new("auto", L["csv_chart_auto_option"]),
            new(",", ","),
            new(";", ";"),
            new("tab", L["csv_chart_tab_option"]),
            new("|", "|"),
        ];

    private IReadOnlyList<SiteSelectOption> ChartTypeOptions =>
        [new("line", L["csv_chart_line_option"]), new("bar", L["csv_chart_bar_option"])];

    private IReadOnlyList<SiteSelectOption> ColumnOptions =>
        _table.IsValid
            ? _table
                .Headers.Select(
                    (header, index) =>
                        new SiteSelectOption(
                            index.ToString(CultureInfo.InvariantCulture),
                            string.IsNullOrWhiteSpace(header)
                                ? L["csv_chart_column_fallback", index + 1]
                                : header
                        )
                )
                .ToArray()
            : [];

    private string CountText => L["csv_chart_count_label", Result.Points.Count];
    private string SummaryText =>
        Result.Points.Count == 0
            ? string.Empty
            : L[
                "csv_chart_summary_label",
                Result.Points.Min(point => point.Y).ToString("G8", CultureInfo.InvariantCulture),
                Result.Points.Max(point => point.Y).ToString("G8", CultureInfo.InvariantCulture)
            ];

    private SiteChartConfig ChartConfig =>
        new()
        {
            Type = ChartTypeText == "bar" ? SiteChartType.Bar : SiteChartType.Line,
            Data = new SiteChartData
            {
                Labels = Result.Points.Select(point => point.Label).ToList(),
                Datasets =
                    ChartTypeText == "bar"
                        ?
                        [
                            new SiteBarDataset
                            {
                                Label = Result.YLabel,
                                Data = Result.Points.Select(point => (object)point.Y).ToList(),
                            },
                        ]
                        :
                        [
                            new SiteLineDataset
                            {
                                Label = Result.YLabel,
                                Data = Result.Points.Select(point => (object)point.Y).ToList(),
                            },
                        ],
            },
        };

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _csvText = QueryCsv ?? _csvText;
        _delimiterText = QueryDelimiter ?? _delimiterText;
        _chartTypeText = QueryType ?? _chartTypeText;
        _xIndexText = QueryX ?? _xIndexText;
        _yIndexText = QueryY ?? _yIndexText;
        _filterText = QueryFilter ?? _filterText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate()
    {
        var delimiter = _delimiterText switch
        {
            "auto" => (char?)null,
            "tab" => '\t',
            { Length: 1 } value => value[0],
            _ => (char?)null,
        };
        _table = CsvChartCalculator.ParseTable(_csvText, delimiter);
        var xIndex = int.TryParse(
            _xIndexText,
            NumberStyles.Integer,
            CultureInfo.InvariantCulture,
            out var x
        )
            ? x
            : 0;
        var yIndex = int.TryParse(
            _yIndexText,
            NumberStyles.Integer,
            CultureInfo.InvariantCulture,
            out var y
        )
            ? y
            : 1;
        _result = CsvChartCalculator.BuildChart(_table, xIndex, yIndex, _filterText);
    }

    private async Task ExportPng()
    {
        if (!RendererInfo.IsInteractive)
            return;
        await JS.InvokeVoidAsync(
            "chartExport.downloadPng",
            "csv-chart-canvas-host",
            "grafico-csv.png"
        );
    }

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
