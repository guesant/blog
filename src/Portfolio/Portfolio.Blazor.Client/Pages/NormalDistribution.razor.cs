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
    private string Action => L["legacy_644041e51dad"];
    private string Title => ToolsL["normal_distribution_title"];
    private string Description => ToolsL["normal_distribution_lead"];
    private string InputLabel => L["legacy_d9825dc0fc2f"];
    private string MeanLabel => L["legacy_bd0cc81ce562"];
    private string DeviationLabel => L["legacy_d2d9f19515f4"];
    private string PointLabel => L["legacy_df572b7ce334"];
    private string ProbabilityLabel => L["legacy_e0e1156cc014"];
    private string DensityLabel => L["legacy_7f8a10f12ea7"];
    private string ChartLabel => L["legacy_7f3a7db24b8b"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string ErrorLabel => L["legacy_057a56375dd3"];
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
                        Label = L["legacy_8f16b60ec1da"],
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
