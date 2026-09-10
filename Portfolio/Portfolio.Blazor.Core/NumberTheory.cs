namespace Portfolio.Blazor.Core;

public enum NumberTheoryError
{
    None,
    InvalidInput,
    LimitExceeded,
}

public readonly record struct NumberTheorySummary(
    bool IsValid,
    int GreatestCommonDivisor,
    long LeastCommonMultiple,
    IReadOnlyList<int> FactorsA,
    IReadOnlyList<int> FactorsB,
    bool IsPrimeA,
    bool IsPrimeB,
    IReadOnlyList<int> Primes,
    NumberTheoryError Error = NumberTheoryError.None
);

public static class NumberTheoryCalculator
{
    public const int MaximumSieveLimit = 100_000;

    public static NumberTheorySummary Analyze(int a, int b, int sieveLimit)
    {
        if (a == 0 || b == 0)
        {
            return Invalid(NumberTheoryError.InvalidInput);
        }

        if (sieveLimit is < 2 or > MaximumSieveLimit)
        {
            return Invalid(NumberTheoryError.LimitExceeded);
        }

        var gcd = GreatestCommonDivisor(a, b);
        var lcm = Math.Abs((long)a / gcd) * Math.Abs((long)b);

        return new NumberTheorySummary(
            IsValid: true,
            GreatestCommonDivisor: gcd,
            LeastCommonMultiple: lcm,
            FactorsA: Factorize(a),
            FactorsB: Factorize(b),
            IsPrimeA: IsPrime(a),
            IsPrimeB: IsPrime(b),
            Primes: Sieve(sieveLimit)
        );
    }

    public static int GreatestCommonDivisor(int a, int b)
    {
        var left = Math.Abs((long)a);
        var right = Math.Abs((long)b);
        while (right != 0)
        {
            (left, right) = (right, left % right);
        }

        return (int)left;
    }

    public static bool IsPrime(int value)
    {
        var candidate = Math.Abs((long)value);
        if (candidate < 2)
        {
            return false;
        }

        for (var divisor = 2L; divisor * divisor <= candidate; divisor++)
        {
            if (candidate % divisor == 0)
            {
                return false;
            }
        }

        return true;
    }

    private static IReadOnlyList<int> Factorize(int value)
    {
        var remaining = Math.Abs((long)value);
        var factors = new List<int>();
        for (var divisor = 2L; divisor * divisor <= remaining; divisor++)
        {
            while (remaining % divisor == 0)
            {
                factors.Add((int)divisor);
                remaining /= divisor;
            }
        }

        if (remaining > 1)
        {
            factors.Add((int)remaining);
        }

        return factors;
    }

    private static IReadOnlyList<int> Sieve(int limit)
    {
        var composite = new bool[limit + 1];
        var primes = new List<int>();
        for (var number = 2; number <= limit; number++)
        {
            if (composite[number])
            {
                continue;
            }

            primes.Add(number);
            if ((long)number * number > limit)
            {
                continue;
            }

            for (var multiple = number * number; multiple <= limit; multiple += number)
            {
                composite[multiple] = true;
            }
        }

        return primes;
    }

    private static NumberTheorySummary Invalid(NumberTheoryError error) =>
        new(
            IsValid: false,
            GreatestCommonDivisor: 0,
            LeastCommonMultiple: 0,
            FactorsA: [],
            FactorsB: [],
            IsPrimeA: false,
            IsPrimeB: false,
            Primes: [],
            Error: error
        );
}
