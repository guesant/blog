using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class AmortizationCalculator
{
    private string CanonicalPath => RequestPath;
    private string _principalText = "10000";
    private string _rateText = "12";
    private string _periodsText = "12";
    private bool _queryInitialized;
    private AmortizationComparison _result =
        Portfolio.Blazor.Core.AmortizationCalculator.CalculateBoth(10000, 12, 12);

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
    private string Title => IsLoan ? (L["legacy_dbf1553b5c5f"]) : (L["legacy_501f3d3caa1f"]);
    private string Description => L["legacy_425dbd96cc7a"];
    private string InputLabel => L["legacy_5b6220fefc5c"];
    private string PrincipalLabel => L["legacy_702e913aa4e2"];
    private string RateLabel => L["legacy_3ec8ab539331"];
    private string PeriodsLabel => L["legacy_59496c17e76b"];
    private string FirstPaymentLabel => L["legacy_9608ac660a8e"];
    private string TotalPaidLabel => L["legacy_e7658b2effb7"];
    private string InterestLabel => L["legacy_04de30cc9c75"];
    private string SubmitLabel => L["legacy_37565a968d31"];
    private string ErrorLabel => L["legacy_30a39ad3bce6"];
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
        _result = Portfolio.Blazor.Core.AmortizationCalculator.CalculateBoth(
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
