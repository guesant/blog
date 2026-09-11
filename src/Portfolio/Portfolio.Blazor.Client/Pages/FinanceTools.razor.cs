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
            FinanceToolMode.Inflation => L["legacy_90a8410649b5"],
            FinanceToolMode.BreakEven => L["legacy_efc1d67881c9"],
            _ => L["legacy_a7e4d0a64bc2"],
        };
    private string Description =>
        Mode switch
        {
            FinanceToolMode.Inflation => L["legacy_fc26e2e3b723"],
            FinanceToolMode.BreakEven => L["legacy_2de4dfd388d1"],
            _ => L["legacy_398f5eec5065"],
        };
    private string InputLabel => L["legacy_d9825dc0fc2f"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string ErrorLabel =>
        Mode switch
        {
            FinanceToolMode.Inflation => L["legacy_5eca2d23680b"],
            FinanceToolMode.BreakEven => L["legacy_4d27f1c17b53"],
            _ => L["legacy_5a6f95aaa0b9"],
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
                (L["legacy_e6f105b6e7ac"], Money(_inflation.AdjustedAmount)),
                (L["legacy_6151715c6f1f"], Money(_inflation.Increase)),
            ],
            FinanceToolMode.BreakEven =>
            [
                (L["legacy_39ffe0cdff3f"], Number(_breakEven.Units)),
                (L["legacy_2c2c627a0fc7"], Money(_breakEven.Revenue)),
            ],
            _ =>
            [
                (L["legacy_e5e02bb9a2ef"], Money(_roi.Profit)),
                (L["legacy_62fad1475e56"], Percent(_roi.ReturnPercent)),
            ],
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
