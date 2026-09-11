namespace Portfolio.Blazor.Core;

public enum AmortizationMethod
{
    Price,
    Sac,
}

public enum AmortizationError
{
    None,
    InvalidInput,
    LimitExceeded,
}

public readonly record struct AmortizationResult(
    bool IsValid,
    double FirstPayment,
    double TotalPaid,
    double Interest,
    AmortizationMethod Method,
    AmortizationError Error = AmortizationError.None
);

public readonly record struct AmortizationSchedulePoint(
    int Period,
    double PriceBalance,
    double SacBalance
);

public readonly record struct AmortizationComparison(
    bool IsValid,
    AmortizationResult Price,
    AmortizationResult Sac,
    IReadOnlyList<AmortizationSchedulePoint> Schedule,
    AmortizationError Error = AmortizationError.None
);

public static class AmortizationCalculator
{
    public const int MaximumPeriods = 1_200;

    public static AmortizationResult Calculate(
        double principal,
        double annualRatePercent,
        int periods,
        AmortizationMethod method
    )
    {
        if (
            !double.IsFinite(principal)
            || !double.IsFinite(annualRatePercent)
            || principal <= 0
            || annualRatePercent < 0
        )
        {
            return Invalid(AmortizationError.InvalidInput, method);
        }

        if (periods is < 1 or > MaximumPeriods)
        {
            return Invalid(AmortizationError.LimitExceeded, method);
        }

        var monthlyRate = annualRatePercent / 100 / 12;
        var payment =
            method == AmortizationMethod.Sac ? principal / periods + principal * monthlyRate
            : monthlyRate == 0 ? principal / periods
            : principal * monthlyRate / (1 - Math.Pow(1 + monthlyRate, -periods));
        var total =
            method == AmortizationMethod.Sac
                ? principal + principal * monthlyRate * (periods + 1) / 2
                : payment * periods;
        return new AmortizationResult(true, payment, total, total - principal, method);
    }

    public static AmortizationComparison CalculateBoth(
        double principal,
        double annualRatePercent,
        int periods
    )
    {
        var price = Calculate(principal, annualRatePercent, periods, AmortizationMethod.Price);
        var sac = Calculate(principal, annualRatePercent, periods, AmortizationMethod.Sac);
        if (!price.IsValid || !sac.IsValid)
        {
            return new AmortizationComparison(
                false,
                price,
                sac,
                [],
                price.Error != AmortizationError.None ? price.Error : sac.Error
            );
        }

        var monthlyRate = annualRatePercent / 100 / 12;
        var pricePayment = price.FirstPayment;
        var sacPrincipal = principal / periods;
        var priceBalance = principal;
        var sacBalance = principal;
        var schedule = new List<AmortizationSchedulePoint>(periods);
        for (var period = 1; period <= periods; period++)
        {
            var priceInterest = priceBalance * monthlyRate;
            var pricePrincipalPortion = Math.Min(pricePayment - priceInterest, priceBalance);
            priceBalance = Math.Max(0, priceBalance - pricePrincipalPortion);
            sacBalance = Math.Max(0, sacBalance - sacPrincipal);
            schedule.Add(new AmortizationSchedulePoint(period, priceBalance, sacBalance));
        }

        return new AmortizationComparison(true, price, sac, schedule);
    }

    private static AmortizationResult Invalid(AmortizationError error, AmortizationMethod method) =>
        new(false, 0, 0, 0, method, error);
}
