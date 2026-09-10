using System.Numerics;

namespace Portfolio.Blazor.Core;

public enum GcdLcmError
{
    None,
    InvalidInput,
    Overflow,
}

public readonly record struct GcdLcmResult(
    bool IsValid,
    long First,
    long Second,
    long Gcd,
    long Lcm,
    GcdLcmError Error = GcdLcmError.None
);

public readonly record struct GcdLcmListResult(
    bool IsValid,
    BigInteger Gcd,
    BigInteger Lcm,
    GcdLcmError Error = GcdLcmError.None
);

public static class GcdLcmCalculator
{
    public static GcdLcmResult Calculate(long first, long second)
    {
        if (first == 0 || second == 0)
        {
            return Invalid(GcdLcmError.InvalidInput);
        }

        var gcd = GreatestCommonDivisor(first, second);
        try
        {
            var lcm = checked(Math.Abs(first / gcd) * Math.Abs(second));
            return new GcdLcmResult(true, first, second, gcd, lcm);
        }
        catch (OverflowException)
        {
            return Invalid(GcdLcmError.Overflow);
        }
    }

    public static GcdLcmListResult Calculate(IReadOnlyList<BigInteger> numbers)
    {
        if (numbers.Count == 0 || numbers.Any(number => number <= 0))
        {
            return new GcdLcmListResult(false, 0, 0, GcdLcmError.InvalidInput);
        }

        var gcd = numbers.Aggregate(GreatestCommonDivisor);
        var lcm = numbers.Aggregate(LeastCommonMultiple);
        return new GcdLcmListResult(true, gcd, lcm);
    }

    private static long GreatestCommonDivisor(long first, long second)
    {
        var left = Math.Abs(first);
        var right = Math.Abs(second);
        while (right != 0)
        {
            (left, right) = (right, left % right);
        }

        return left;
    }

    private static BigInteger GreatestCommonDivisor(BigInteger first, BigInteger second)
    {
        var left = BigInteger.Abs(first);
        var right = BigInteger.Abs(second);
        while (right != 0)
        {
            (left, right) = (right, left % right);
        }

        return left;
    }

    private static BigInteger LeastCommonMultiple(BigInteger first, BigInteger second)
    {
        if (first == 0 || second == 0)
        {
            return 0;
        }

        return BigInteger.Abs(first / GreatestCommonDivisor(first, second) * second);
    }

    private static GcdLcmResult Invalid(GcdLcmError error) => new(false, 0, 0, 0, 0, error);
}
