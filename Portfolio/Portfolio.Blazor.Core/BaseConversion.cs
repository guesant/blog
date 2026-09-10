using System.Numerics;

namespace Portfolio.Blazor.Core;

public sealed record BaseConversionResult(bool IsValid, string Output, string? Error);

public static class BaseConversionCalculator
{
    public const int MaximumDigits = 256;

    public static BaseConversionResult Convert(string value, int fromBase, int toBase)
    {
        if (
            string.IsNullOrWhiteSpace(value)
            || value.Trim().Length > MaximumDigits
            || fromBase is < 2 or > 36
            || toBase is < 2 or > 36
        )
        {
            return new(false, string.Empty, "invalid_input");
        }

        var text = value.Trim().ToUpperInvariant();
        var negative = text.StartsWith('-');
        if (negative)
            text = text[1..];
        if (text.Length == 0)
            return new(false, string.Empty, "invalid_input");

        var number = BigInteger.Zero;
        foreach (var character in text)
        {
            var digit = DigitValue(character);
            if (digit < 0 || digit >= fromBase)
                return new(false, string.Empty, "invalid_digit");
            number = number * fromBase + digit;
        }

        var output = ToBase(number, toBase);
        return new(true, negative && number != BigInteger.Zero ? $"-{output}" : output, null);
    }

    private static int DigitValue(char character) =>
        character switch
        {
            >= '0' and <= '9' => character - '0',
            >= 'A' and <= 'Z' => character - 'A' + 10,
            _ => -1,
        };

    private static string ToBase(BigInteger number, int toBase)
    {
        if (number == BigInteger.Zero)
            return "0";
        var digits = new List<char>();
        while (number > BigInteger.Zero)
        {
            var remainder = (int)(number % toBase);
            digits.Add(remainder < 10 ? (char)('0' + remainder) : (char)('A' + remainder - 10));
            number /= toBase;
        }
        digits.Reverse();
        return new string(digits.ToArray());
    }
}
