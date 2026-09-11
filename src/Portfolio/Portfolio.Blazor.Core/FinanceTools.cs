namespace Portfolio.Blazor.Core;

public readonly record struct RoiResult(bool IsValid, double Profit, double ReturnPercent);

public readonly record struct InflationResult(bool IsValid, double AdjustedAmount, double Increase);

public readonly record struct BreakEvenResult(bool IsValid, double Units, double Revenue);

public static class FinanceToolsCalculator
{
    public const int MaximumPeriods = 10_000;

    public static RoiResult Roi(double investment, double returnValue)
    {
        if (
            !double.IsFinite(investment)
            || !double.IsFinite(returnValue)
            || investment <= 0
            || returnValue < 0
        )
        {
            return new(false, double.NaN, double.NaN);
        }

        var profit = returnValue - investment;
        return new(true, profit, profit / investment * 100);
    }

    public static InflationResult AdjustForInflation(double amount, double ratePercent, int periods)
    {
        if (
            !double.IsFinite(amount)
            || !double.IsFinite(ratePercent)
            || amount < 0
            || ratePercent <= -100
            || periods is < 0 or > MaximumPeriods
        )
        {
            return new(false, double.NaN, double.NaN);
        }

        var adjusted = amount * Math.Pow(1 + ratePercent / 100, periods);
        return double.IsFinite(adjusted)
            ? new(true, adjusted, adjusted - amount)
            : new(false, double.NaN, double.NaN);
    }

    public static BreakEvenResult BreakEven(
        double fixedCosts,
        double unitPrice,
        double variableCost
    )
    {
        if (
            !double.IsFinite(fixedCosts)
            || !double.IsFinite(unitPrice)
            || !double.IsFinite(variableCost)
            || fixedCosts < 0
            || unitPrice <= variableCost
            || variableCost < 0
        )
        {
            return new(false, double.NaN, double.NaN);
        }

        var units = fixedCosts / (unitPrice - variableCost);
        var revenue = units * unitPrice;
        return double.IsFinite(units) && double.IsFinite(revenue)
            ? new(true, units, revenue)
            : new(false, double.NaN, double.NaN);
    }
}
