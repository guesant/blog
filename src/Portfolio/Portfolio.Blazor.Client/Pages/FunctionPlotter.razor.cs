using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class FunctionPlotter
{
    private string CanonicalPath => RequestPath;
    private string _expressionText = "sin(x)";
    private string _minimumText = "-6.28";
    private string _maximumText = "6.28";
    private FunctionPlotResult _result = Portfolio.Blazor.Core.FunctionPlotter.Analyze(
        "sin(x)",
        -6.28,
        6.28
    );
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "expression")]
    private string? QueryExpression { get; set; }

    [SupplyParameterFromQuery(Name = "min")]
    private string? QueryMinimum { get; set; }

    [SupplyParameterFromQuery(Name = "max")]
    private string? QueryMaximum { get; set; }
    private string Action => L["legacy_35e6aab7dac8"];
    private string Title => ToolsL["function_plotter_title"];
    private string Description => ToolsL["function_plotter_lead"];
    private string InputLabel => L["legacy_492c2a86ee4a"];
    private string ExpressionLabel => L["legacy_31c2fd5d2ab4"];
    private string MinimumLabel => L["legacy_78e9e6a55375"];
    private string MaximumLabel => L["legacy_3508c7d57ea7"];
    private string SamplesLabel => L["legacy_75a0d73a5c30"];
    private string ChartLabel => L["legacy_6affb9b73508"];
    private string SubmitLabel => L["legacy_44c94566af88"];
    private string ErrorLabel => L["legacy_e80a92c29f64"];
    private string ExpressionText
    {
        get => _expressionText;
        set
        {
            _expressionText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string MinimumText
    {
        get => _minimumText;
        set
        {
            _minimumText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string MaximumText
    {
        get => _maximumText;
        set
        {
            _maximumText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private FunctionPlotResult Result => _result;
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
                        Label = ExpressionText,
                        Data = Result.Points.Select(point => (object)point.Y).ToList(),
                    },
                ],
            },
        };

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _expressionText = QueryExpression ?? _expressionText;
        _minimumText = QueryMinimum ?? _minimumText;
        _maximumText = QueryMaximum ?? _maximumText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = Portfolio.Blazor.Core.FunctionPlotter.Analyze(
            _expressionText,
            Parse(_minimumText),
            Parse(_maximumText)
        );

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Format(double value) =>
        value.ToString("G6", CultureInfo.InvariantCulture);

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
