namespace Blog.Blazor.Core;

public enum PrimeFactorizationError
{
    None,
    InvalidInput,
    LimitExceeded,
}

public readonly record struct PrimeFactorizationResult(
    bool IsValid,
    long Number,
    IReadOnlyList<long> Factors,
    PrimeFactorizationError Error = PrimeFactorizationError.None
);

public static class PrimeFactorizationCalculator
{
    public const long MaximumInput = 1_000_000_000_000;

    public static PrimeFactorizationResult Factor(long number)
    {
        if (number is 0 or 1 or -1)
        {
            return Invalid(PrimeFactorizationError.InvalidInput);
        }

        if (number == long.MinValue || Math.Abs(number) > MaximumInput)
        {
            return Invalid(PrimeFactorizationError.LimitExceeded);
        }

        var remaining = Math.Abs(number);
        var factors = new List<long>();
        for (var divisor = 2L; divisor * divisor <= remaining; divisor += divisor == 2 ? 1 : 2)
        {
            while (remaining % divisor == 0)
            {
                factors.Add(divisor);
                remaining /= divisor;
            }
        }

        if (remaining > 1)
        {
            factors.Add(remaining);
        }

        return new PrimeFactorizationResult(true, number, factors);
    }

    private static PrimeFactorizationResult Invalid(PrimeFactorizationError error) =>
        new(false, 0, [], error);
}
