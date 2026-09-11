using System.Globalization;
using System.Numerics;

namespace Portfolio.Blazor.Core;

public readonly record struct Fraction(BigInteger Numerator, BigInteger Denominator)
{
    public override string ToString() =>
        Denominator == 1
            ? Numerator.ToString(CultureInfo.InvariantCulture)
            : $"{Numerator.ToString(CultureInfo.InvariantCulture)}/{Denominator.ToString(CultureInfo.InvariantCulture)}";
}

public sealed record FractionResult(bool IsValid, Fraction Value, string? Error);

public static class FractionCalculator
{
    public static FractionResult Calculate(string first, char operation, string second)
    {
        if (!TryParse(first, out var left) || !TryParse(second, out var right))
        {
            return Invalid("invalid_fraction");
        }

        if (operation == '/' && right.Numerator == 0)
            return Invalid("division_by_zero");
        var numerator = operation switch
        {
            '+' => left.Numerator * right.Denominator + right.Numerator * left.Denominator,
            '-' => left.Numerator * right.Denominator - right.Numerator * left.Denominator,
            '*' => left.Numerator * right.Numerator,
            '/' => left.Numerator * right.Denominator,
            _ => BigInteger.Zero,
        };
        var denominator = operation switch
        {
            '+' or '-' => left.Denominator * right.Denominator,
            '*' => left.Denominator * right.Denominator,
            '/' => left.Denominator * right.Numerator,
            _ => BigInteger.Zero,
        };
        if (denominator == 0)
            return Invalid("invalid_operation");
        return new(true, Normalize(numerator, denominator), null);
    }

    public static FractionResult Simplify(string value)
    {
        return TryParse(value, out var fraction)
            ? new(true, fraction, null)
            : Invalid("invalid_fraction");
    }

    private static bool TryParse(string text, out Fraction fraction)
    {
        fraction = default;
        var parts = text.Trim().Split('/', StringSplitOptions.TrimEntries);
        if (parts.Length is < 1 or > 2 || !BigInteger.TryParse(parts[0], out var numerator))
            return false;
        var denominator =
            parts.Length == 2 && BigInteger.TryParse(parts[1], out var parsed) ? parsed
            : parts.Length == 1 ? BigInteger.One
            : BigInteger.Zero;
        if (denominator == 0)
            return false;
        fraction = Normalize(numerator, denominator);
        return true;
    }

    private static Fraction Normalize(BigInteger numerator, BigInteger denominator)
    {
        if (denominator < 0)
        {
            numerator = -numerator;
            denominator = -denominator;
        }
        var gcd = BigInteger.GreatestCommonDivisor(BigInteger.Abs(numerator), denominator);
        return new(numerator / gcd, denominator / gcd);
    }

    private static FractionResult Invalid(string error) => new(false, default, error);
}
