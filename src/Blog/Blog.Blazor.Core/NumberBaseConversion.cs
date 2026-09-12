using System.Numerics;

namespace Blog.Blazor.Core;

public sealed record NumberBaseConversionResult(
    bool IsValid,
    string Binary,
    string Octal,
    string Decimal,
    string Hexadecimal,
    int DetectedBase,
    string? Error
);

public static class NumberBaseConversionCalculator
{
    public const int MaximumDigits = 256;

    public static NumberBaseConversionResult Convert(string? value, int selectedBase)
    {
        if (string.IsNullOrWhiteSpace(value))
            return new(true, "", "", "", "", selectedBase, null);
        var text = value.Trim();
        if (text.Length > MaximumDigits)
            return Invalid("too_long");
        var negative = text.StartsWith('-');
        if (negative)
            text = text[1..];
        if (text.Length == 0)
            return Invalid("invalid_input");
        var numberBase =
            selectedBase == 0
                ? text.StartsWith("0b", StringComparison.OrdinalIgnoreCase)
                    ? 2
                    : text.StartsWith("0o", StringComparison.OrdinalIgnoreCase)
                        ? 8
                        : text.StartsWith("0x", StringComparison.OrdinalIgnoreCase)
                            ? 16
                            : 10
                : selectedBase;
        if (numberBase is not (2 or 8 or 10 or 16))
            return Invalid("invalid_base");
        var prefix = numberBase switch
        {
            2 => "0b",
            8 => "0o",
            16 => "0x",
            _ => "",
        };
        if (text.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            text = text[prefix.Length..];
        if (text.Length == 0)
            return Invalid("invalid_input");
        var number = BigInteger.Zero;
        foreach (var character in text.ToUpperInvariant())
        {
            var digit =
                character is >= '0' and <= '9' ? character - '0'
                : character is >= 'A' and <= 'Z' ? character - 'A' + 10
                : -1;
            if (digit < 0 || digit >= numberBase)
                return Invalid("invalid_digit");
            number = number * numberBase + digit;
        }
        if (negative && number != BigInteger.Zero)
            number = -number;
        return new(
            true,
            ToBase(number, 2),
            ToBase(number, 8),
            ToBase(number, 10),
            ToBase(number, 16),
            numberBase,
            null
        );
    }

    private static NumberBaseConversionResult Invalid(string error) =>
        new(false, "", "", "", "", 0, error);

    private static string ToBase(BigInteger number, int radix)
    {
        if (number == 0)
            return "0";
        var negative = number < 0;
        number = BigInteger.Abs(number);
        var digits = new List<char>();
        while (number > 0)
        {
            var remainder = (int)(number % radix);
            digits.Add(remainder < 10 ? (char)('0' + remainder) : (char)('A' + remainder - 10));
            number /= radix;
        }
        if (negative)
            digits.Add('-');
        digits.Reverse();
        return new string(digits.ToArray());
    }
}
