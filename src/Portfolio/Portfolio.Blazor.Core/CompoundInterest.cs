namespace Portfolio.Blazor.Core;

public enum CompoundInterestError
{
    None,
    InvalidInput,
    LimitExceeded,
}

public readonly record struct CompoundInterestResult(
    bool IsValid,
    double FutureValue,
    double TotalContributed,
    double InterestEarned,
    CompoundInterestError Error = CompoundInterestError.None
);

public static class CompoundInterestCalculator
{
    public const int MaximumPeriods = 10_000;

    public static CompoundInterestResult Solve(
        double principal,
        double ratePercent,
        int periods,
        double contribution
    )
    {
        if (
            !double.IsFinite(principal)
            || !double.IsFinite(ratePercent)
            || !double.IsFinite(contribution)
            || principal < 0
            || contribution < 0
            || ratePercent <= -100
        )
        {
            return Invalid(CompoundInterestError.InvalidInput);
        }

        if (periods is < 1 or > MaximumPeriods)
        {
            return Invalid(CompoundInterestError.LimitExceeded);
        }

        var rate = ratePercent / 100;
        var growth = Math.Pow(1 + rate, periods);
        var futureValue =
            rate == 0
                ? principal + contribution * periods
                : principal * growth + contribution * ((growth - 1) / rate);
        var totalContributed = principal + contribution * periods;

        return new CompoundInterestResult(
            IsValid: true,
            FutureValue: futureValue,
            TotalContributed: totalContributed,
            InterestEarned: futureValue - totalContributed
        );
    }

    private static CompoundInterestResult Invalid(CompoundInterestError error) =>
        new(
            IsValid: false,
            FutureValue: double.NaN,
            TotalContributed: double.NaN,
            InterestEarned: double.NaN,
            Error: error
        );
}
