using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class Correlation
{
    private string CanonicalPath => RequestPath;
    private string _xText = "1 2 3 4 5";
    private string _yText = "2 4 5 4 6";
    private CorrelationResult _result = CorrelationCalculator.Analyze("1 2 3 4 5", "2 4 5 4 6");
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "x")]
    private string? QueryX { get; set; }

    [SupplyParameterFromQuery(Name = "y")]
    private string? QueryY { get; set; }
    private bool IsRegression =>
        Navigation.Uri.Contains("/linear-regression", StringComparison.OrdinalIgnoreCase);
    private string Action =>
        LocalizedUrls.Current(
            $"/tools/{(IsRegression ? "linear-regression" : "correlation-calculator")}"
        );
    private string Title =>
        IsRegression
            ? (ToolsL["linear_regression_title"])
            : (ToolsL["correlation_calculator_title"]);
    private string Description => ToolsL["correlation_calculator_lead"];
    private string InputLabel => L["numeric_series"];
    private string XLabel => L["x_series"];
    private string YLabel => L["y_series"];
    private string CountLabel => L["points"];
    private string CorrelationLabel => L["pearson_correlation_r"];
    private string SlopeLabel => L["slope"];
    private string InterceptLabel => L["intercept"];
    private string R2Label => L["coefficient_of_determination_r2"];
    private string ChartLabel => L["scatter_plot_and_regression_line"];
    private string SubmitLabel => L["analyze"];
    private string ErrorLabel =>
        Result.Error switch
        {
            CorrelationError.MismatchedLengths => L[
                "the_series_must_have_the_same_number_of_values"
            ],
            CorrelationError.ConstantSeries => L["the_series_cannot_be_constant"],
            _ => L["provide_at_least_two_valid_numbers_in_each"],
        };
    private string XText
    {
        get => _xText;
        set
        {
            _xText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string YText
    {
        get => _yText;
        set
        {
            _yText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private CorrelationResult Result => _result;
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
                        Data = Result.Points.Select(point => (object)point.Y).ToList(),
                    },
                    new SiteLineDataset
                    {
                        Label = L["regression_line"],
                        Data = Result
                            .Points.Select(point =>
                                (object)(Result.Slope * point.X + Result.Intercept)
                            )
                            .ToList(),
                    },
                ],
            },
        };

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _xText = QueryX ?? _xText;
            _yText = QueryY ?? _yText;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate() => _result = CorrelationCalculator.Analyze(_xText, _yText);

    private static string Format(double value) =>
        value.ToString("G6", CultureInfo.InvariantCulture);

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
