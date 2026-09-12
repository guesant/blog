using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class AmortizationCalculator
{
    private string CanonicalPath => RequestPath;
    private string _principalText = "10000";
    private string _rateText = "12";
    private string _periodsText = "12";
    private bool _queryInitialized;
    private AmortizationComparison _result = Blog.Blazor.Core.AmortizationCalculator.CalculateBoth(
        10000,
        12,
        12
    );

    [SupplyParameterFromQuery(Name = "principal")]
    private string? QueryPrincipal { get; set; }

    [SupplyParameterFromQuery(Name = "rate")]
    private string? QueryRate { get; set; }

    [SupplyParameterFromQuery(Name = "periods")]
    private string? QueryPeriods { get; set; }
    private bool IsLoan =>
        Navigation.Uri.Contains("loan-interest-calculator", StringComparison.OrdinalIgnoreCase);
    private string Action =>
        LocalizedUrls.Current(
            $"/tools/{(IsLoan ? "loan-interest-calculator" : "amortization-calculator")}"
        );
    private string Title =>
        IsLoan
            ? (ToolsL["loan_interest_calculator_page_title"])
            : (ToolsL["amortization_calculator_title"]);
    private string Description => ToolsL["amortization_calculator_lead"];
    private string InputLabel => L["parameters"];
    private string PrincipalLabel => L["financed_amount"];
    private string RateLabel => L["annual_rate"];
    private string PeriodsLabel => L["monthly_payments"];
    private string FirstPaymentLabel => L["first_payment"];
    private string TotalPaidLabel => L["total_paid"];
    private string InterestLabel => L["interest"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_a_valid_principal_rate_and_number_of"];
    private string ChartLabel => L["amortization_chart_label"];
    private string PeriodLabel => L["amortization_period_label"];
    private string PriceSeriesLabel => L["amortization_price_series"];
    private string SacSeriesLabel => L["amortization_sac_series"];
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));
    private string PrincipalText
    {
        get => _principalText;
        set
        {
            _principalText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string RateText
    {
        get => _rateText;
        set
        {
            _rateText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string PeriodsText
    {
        get => _periodsText;
        set
        {
            _periodsText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private AmortizationComparison Result => _result;
    private SiteChartConfig ChartConfig =>
        new()
        {
            Type = SiteChartType.Line,
            Data = new SiteChartData
            {
                Labels = Result
                    .Schedule.Select(point => point.Period.ToString(CultureInfo.InvariantCulture))
                    .ToList(),
                Datasets =
                [
                    new SiteLineDataset
                    {
                        Label = PriceSeriesLabel,
                        Data = Result.Schedule.Select(point => (object)point.PriceBalance).ToList(),
                    },
                    new SiteLineDataset
                    {
                        Label = SacSeriesLabel,
                        Data = Result.Schedule.Select(point => (object)point.SacBalance).ToList(),
                    },
                ],
            },
        };

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _principalText = QueryPrincipal ?? _principalText;
            _rateText = QueryRate ?? _rateText;
            _periodsText = QueryPeriods ?? _periodsText;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate() =>
        _result = Blog.Blazor.Core.AmortizationCalculator.CalculateBoth(
            Parse(_principalText),
            Parse(_rateText),
            int.TryParse(
                _periodsText,
                NumberStyles.Integer,
                CultureInfo.InvariantCulture,
                out var periods
            )
                ? periods
                : 0
        );

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Money(double value) => value.ToString("N2", CultureInfo.InvariantCulture);

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
