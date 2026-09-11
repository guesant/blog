using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class NormalDistribution
{
    private string CanonicalPath => RequestPath;
    private string _meanText = "0";
    private string _deviationText = "1";
    private string _pointText = "1.96";
    private NormalDistributionResult _result = NormalDistributionCalculator.Analyze(0, 1, 1.96);
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "mean")]
    private string? QueryMean { get; set; }

    [SupplyParameterFromQuery(Name = "deviation")]
    private string? QueryDeviation { get; set; }

    [SupplyParameterFromQuery(Name = "point")]
    private string? QueryPoint { get; set; }
    private string Action => L["tools_normal_distribution"];
    private string Title => ToolsL["normal_distribution_title"];
    private string Description => ToolsL["normal_distribution_lead"];
    private string InputLabel => L["parameters"];
    private string MeanLabel => L["mean"];
    private string DeviationLabel => L["standard_deviation"];
    private string PointLabel => L["point"];
    private string ProbabilityLabel => L["p_x_x"];
    private string DensityLabel => L["density_at_x"];
    private string ChartLabel => L["normal_distribution_curve"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_a_valid_mean_positive_standard"];
    private string MeanText
    {
        get => _meanText;
        set
        {
            _meanText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string DeviationText
    {
        get => _deviationText;
        set
        {
            _deviationText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string PointText
    {
        get => _pointText;
        set
        {
            _pointText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private NormalDistributionResult Result => _result;
    private SiteChartConfig ChartConfig =>
        new()
        {
            Type = SiteChartType.Line,
            Data = new SiteChartData
            {
                Labels = Result.Points.Select(point => Format(point.X)).ToList(),
                Datasets =
                [
                    new SiteLineDataset
                    {
                        Label = ChartLabel,
                        Data = Result.Points.Select(point => (object)point.Density).ToList(),
                    },
                    new SiteLineDataset
                    {
                        Label = L["selected_point"],
                        Data = Result
                            .Points.Select(
                                (point, index) =>
                                    index == SelectedPointIndex ? (object)point.Density : null!
                            )
                            .ToList(),
                    },
                ],
            },
        };
    private int SelectedPointIndex =>
        Result.Points.Count == 0
            ? -1
            : Result
                .Points.Select((point, index) => (point, index))
                .OrderBy(item => Math.Abs(item.point.X - Parse(_pointText)))
                .First()
                .index;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _meanText = QueryMean ?? _meanText;
        _deviationText = QueryDeviation ?? _deviationText;
        _pointText = QueryPoint ?? _pointText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = NormalDistributionCalculator.Analyze(
            Parse(_meanText),
            Parse(_deviationText),
            Parse(_pointText)
        );

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Format(double value) =>
        value.ToString("G6", CultureInfo.InvariantCulture);

    private static string Percent(double value) =>
        $"{(value * 100).ToString("G6", CultureInfo.InvariantCulture)}%";

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
