using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

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
    private string InputLabel => L["legacy_7ef23c6467bd"];
    private string XLabel => L["legacy_280005dd8f05"];
    private string YLabel => L["legacy_44c6bdd1d76b"];
    private string CountLabel => L["legacy_0ce5db4763a3"];
    private string CorrelationLabel => L["legacy_f4d4de40d5d9"];
    private string SlopeLabel => L["legacy_dec16ece71b2"];
    private string InterceptLabel => L["legacy_ec0ece99067d"];
    private string R2Label => L["legacy_ba1311430910"];
    private string ChartLabel => L["legacy_4a9a3679fafc"];
    private string SubmitLabel => L["legacy_4c0a9833b6a4"];
    private string ErrorLabel =>
        Result.Error switch
        {
            CorrelationError.MismatchedLengths => L["legacy_6b0a980b196d"],
            CorrelationError.ConstantSeries => L["legacy_a8447b375a25"],
            _ => L["legacy_2e7d2313c7b1"],
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
                        Label = L["legacy_e5f240440152"],
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
