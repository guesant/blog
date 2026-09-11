using System.Numerics;

namespace Portfolio.Blazor.Core;

public sealed record CombinatoricsResult(
    bool IsValid,
    BigInteger Factorial,
    BigInteger Permutation,
    BigInteger Combination,
    string? Error
);

public static class CombinatoricsCalculator
{
    public const int MaximumN = 500;

    public static CombinatoricsResult Calculate(int n, int r)
    {
        if (n < 0 || n > MaximumN || r < 0 || r > n)
        {
            return new(false, BigInteger.Zero, BigInteger.Zero, BigInteger.Zero, "invalid_range");
        }

        var factorial = Factorial(n);
        var permutation = factorial / Factorial(n - r);
        var combination = permutation / Factorial(r);
        return new(true, factorial, permutation, combination, null);
    }

    private static BigInteger Factorial(int value)
    {
        var result = BigInteger.One;
        for (var index = 2; index <= value; index++)
            result *= index;
        return result;
    }
}
