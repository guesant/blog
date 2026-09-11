using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class FinanceTools
{
    private string CanonicalPath => RequestPath;

    private enum FinanceToolMode
    {
        Roi,
        Inflation,
        BreakEven,
    }

    private string _investmentText = "1000";
    private string _returnText = "1250";
    private string _amountText = "1000";
    private string _rateText = "4";
    private string _periodsText = "12";
    private string _fixedCostsText = "5000";
    private string _unitPriceText = "100";
    private string _variableCostText = "40";
    private RoiResult _roi = FinanceToolsCalculator.Roi(1000, 1250);
    private InflationResult _inflation = FinanceToolsCalculator.AdjustForInflation(1000, 4, 12);
    private BreakEvenResult _breakEven = FinanceToolsCalculator.BreakEven(5000, 100, 40);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "investment")]
    private string? QueryInvestment { get; set; }

    [SupplyParameterFromQuery(Name = "return")]
    private string? QueryReturn { get; set; }

    [SupplyParameterFromQuery(Name = "amount")]
    private string? QueryAmount { get; set; }

    [SupplyParameterFromQuery(Name = "rate")]
    private string? QueryRate { get; set; }

    [SupplyParameterFromQuery(Name = "periods")]
    private string? QueryPeriods { get; set; }

    [SupplyParameterFromQuery(Name = "fixed")]
    private string? QueryFixedCosts { get; set; }

    [SupplyParameterFromQuery(Name = "price")]
    private string? QueryUnitPrice { get; set; }

    [SupplyParameterFromQuery(Name = "variable")]
    private string? QueryVariableCost { get; set; }

    private FinanceToolMode Mode =>
        Navigation.Uri.Contains("inflation-calculator", StringComparison.OrdinalIgnoreCase)
            ? FinanceToolMode.Inflation
        : Navigation.Uri.Contains("break-even-calculator", StringComparison.OrdinalIgnoreCase)
            ? FinanceToolMode.BreakEven
        : FinanceToolMode.Roi;
    private string Action =>
        LocalizedUrls.Current(
            $"/tools/{(Mode switch { FinanceToolMode.Roi => "roi-calculator", FinanceToolMode.Inflation => "inflation-calculator", _ => "break-even-calculator" })}"
        );
    private string Title =>
        Mode switch
        {
            FinanceToolMode.Inflation => L["inflation_calculator"],
            FinanceToolMode.BreakEven => L["break_even_calculator"],
            _ => L["roi_calculator"],
        };
    private string Description =>
        Mode switch
        {
            FinanceToolMode.Inflation => L["estimate_how_much_an_amount_must_keep_up_with"],
            FinanceToolMode.BreakEven => L["calculate_how_many_units_must_be_sold_to_cover"],
            _ => L["calculate_profit_and_return_on_the_amount"],
        };
    private string InputLabel => L["parameters"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel =>
        Mode switch
        {
            FinanceToolMode.Inflation => L["provide_a_valid_amount_rate_and_number_of"],
            FinanceToolMode.BreakEven => L["the_unit_price_must_be_greater_than_the"],
            _ => L["provide_a_positive_investment_and_a_valid_return"],
        };
    private bool IsValid =>
        Mode switch
        {
            FinanceToolMode.Inflation => _inflation.IsValid,
            FinanceToolMode.BreakEven => _breakEven.IsValid,
            _ => _roi.IsValid,
        };
    private IEnumerable<(string Label, string Value)> Metrics =>
        Mode switch
        {
            FinanceToolMode.Inflation =>
            [
                (L["adjusted_value"], Money(_inflation.AdjustedAmount)),
                (L["increase"], Money(_inflation.Increase)),
            ],
            FinanceToolMode.BreakEven =>
            [
                (L["break_even_units"], Number(_breakEven.Units)),
                (L["break_even_revenue"], Money(_breakEven.Revenue)),
            ],
            _ => [(L["profit"], Money(_roi.Profit)), (L["return"], Percent(_roi.ReturnPercent))],
        };

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _investmentText = QueryInvestment ?? _investmentText;
        _returnText = QueryReturn ?? _returnText;
        _amountText = QueryAmount ?? _amountText;
        _rateText = QueryRate ?? _rateText;
        _periodsText = QueryPeriods ?? _periodsText;
        _fixedCostsText = QueryFixedCosts ?? _fixedCostsText;
        _unitPriceText = QueryUnitPrice ?? _unitPriceText;
        _variableCostText = QueryVariableCost ?? _variableCostText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate()
    {
        _roi = FinanceToolsCalculator.Roi(Parse(_investmentText), Parse(_returnText));
        _inflation = FinanceToolsCalculator.AdjustForInflation(
            Parse(_amountText),
            Parse(_rateText),
            ParseInt(_periodsText)
        );
        _breakEven = FinanceToolsCalculator.BreakEven(
            Parse(_fixedCostsText),
            Parse(_unitPriceText),
            Parse(_variableCostText)
        );
    }

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static int ParseInt(string value) =>
        int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var result)
            ? result
            : 0;

    private static string Money(double value) => value.ToString("N2", CultureInfo.InvariantCulture);

    private static string Number(double value) =>
        value.ToString("N2", CultureInfo.InvariantCulture);

    private static string Percent(double value) =>
        $"{value.ToString("N2", CultureInfo.InvariantCulture)}%";

    private string InvestmentText
    {
        get => _investmentText;
        set
        {
            _investmentText = value;
            Recalculate();
        }
    }
    private string ReturnText
    {
        get => _returnText;
        set
        {
            _returnText = value;
            Recalculate();
        }
    }
    private string AmountText
    {
        get => _amountText;
        set
        {
            _amountText = value;
            Recalculate();
        }
    }
    private string RateText
    {
        get => _rateText;
        set
        {
            _rateText = value;
            Recalculate();
        }
    }
    private string PeriodsText
    {
        get => _periodsText;
        set
        {
            _periodsText = value;
            Recalculate();
        }
    }
    private string FixedCostsText
    {
        get => _fixedCostsText;
        set
        {
            _fixedCostsText = value;
            Recalculate();
        }
    }
    private string UnitPriceText
    {
        get => _unitPriceText;
        set
        {
            _unitPriceText = value;
            Recalculate();
        }
    }
    private string VariableCostText
    {
        get => _variableCostText;
        set
        {
            _variableCostText = value;
            Recalculate();
        }
    }
}
