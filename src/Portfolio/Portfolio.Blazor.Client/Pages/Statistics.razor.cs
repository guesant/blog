using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Statistics
{
    private string CanonicalPath => RequestPath;
    private string _values = "1 2 2 3 4";
    private StatisticsSummary _summary = DescriptiveStatisticsCalculator.Analyze("1 2 2 3 4");
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "values")]
    private string? QueryValues { get; set; }
    private string Action => L["legacy_264f2a8c5e84"];
    private string Title => ToolsL["statistics_page_title"];
    private string Description => ToolsL["statistics_lead"];
    private string InputLabel => L["legacy_d6b96d7e7072"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string CountLabel => L["legacy_1cca238ca682"];
    private string MinimumLabel => L["legacy_817f5288d94b"];
    private string MaximumLabel => L["legacy_b1be8ef71097"];
    private string MeanLabel => L["legacy_bd0cc81ce562"];
    private string MedianLabel => L["legacy_88d5137cdffb"];
    private string ModeLabel => L["legacy_84981e5d02b2"];
    private string NoModeLabel => L["legacy_a189d42e3a37"];
    private static string FirstQuartileLabel => "Q1";
    private static string ThirdQuartileLabel => "Q3";
    private static string IqrLabel => "IQR";
    private string PopulationStdDevLabel => L["legacy_99b53267b82d"];
    private string SampleStdDevLabel => L["legacy_b8c4256bc427"];
    private string HistogramLabel => L["legacy_02170aaac43d"];
    private string BinItemsLabel => L["legacy_405448a63f0e"];
    private string ErrorMessage =>
        Summary.Error == StatisticsError.InvalidNumber
            ? (L["legacy_f8421ef9ff43"])
            : (L["legacy_2f9e5de45de8"]);
    private string Values
    {
        get => _values;
        set
        {
            _values = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private StatisticsSummary Summary => _summary;
    private int MaxBinCount =>
        Summary.Histogram.Count == 0 ? 0 : Summary.Histogram.Max(bin => bin.Count);
    private SiteChartConfig HistogramConfig =>
        new()
        {
            Type = SiteChartType.Bar,
            Data = new SiteChartData
            {
                Labels = Summary
                    .Histogram.Select(bin => $"{Format(bin.Start)}–{Format(bin.End)}")
                    .ToList(),
                Datasets =
                [
                    new SiteBarDataset
                    {
                        Label = BinItemsLabel,
                        Data = Summary.Histogram.Select(bin => (object)bin.Count).ToList(),
                    },
                ],
            },
        };

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _values = QueryValues ?? _values;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate() => _summary = DescriptiveStatisticsCalculator.Analyze(_values);

    private static string Format(double value) =>
        double.IsNaN(value) ? "—" : value.ToString("G12", CultureInfo.InvariantCulture);

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
