using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class Statistics
{
    private string CanonicalPath => RequestPath;
    private string _values = "1 2 2 3 4";
    private StatisticsSummary _summary = DescriptiveStatisticsCalculator.Analyze("1 2 2 3 4");
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "values")]
    private string? QueryValues { get; set; }
    private string Action => L["tools_statistics"];
    private string Title => ToolsL["statistics_page_title"];
    private string Description => ToolsL["statistics_lead"];
    private string InputLabel => L["values"];
    private string SubmitLabel => L["calculate"];
    private string CountLabel => L["count"];
    private string MinimumLabel => L["minimum"];
    private string MaximumLabel => L["maximum"];
    private string MeanLabel => L["mean"];
    private string MedianLabel => L["median"];
    private string ModeLabel => L["statistical_mode"];
    private string NoModeLabel => L["no_mode"];
    private static string FirstQuartileLabel => "Q1";
    private static string ThirdQuartileLabel => "Q3";
    private static string IqrLabel => "IQR";
    private string PopulationStdDevLabel => L["population_standard_deviation"];
    private string SampleStdDevLabel => L["sample_standard_deviation"];
    private string HistogramLabel => L["histogram"];
    private string BinItemsLabel => L["items"];
    private string ErrorMessage =>
        Summary.Error == StatisticsError.InvalidNumber
            ? (L["use_finite_numbers_separated_by_spaces_commas"])
            : (L["provide_at_least_one_value"]);
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
