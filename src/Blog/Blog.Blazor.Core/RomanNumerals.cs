namespace Blog.Blazor.Core;

public sealed record RomanNumeralResult(
    bool NumberValid,
    string RomanFromNumber,
    string NumberFromRoman,
    bool RomanValid
);

public static class RomanNumerals
{
    private static readonly (int Value, string Symbol)[] Values =
    [
        (1000, "M"),
        (900, "CM"),
        (500, "D"),
        (400, "CD"),
        (100, "C"),
        (90, "XC"),
        (50, "L"),
        (40, "XL"),
        (10, "X"),
        (9, "IX"),
        (5, "V"),
        (4, "IV"),
        (1, "I"),
    ];
    private static readonly System.Text.RegularExpressions.Regex Pattern = new(
        "^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$",
        System.Text.RegularExpressions.RegexOptions.Compiled
    );

    public static string ToRoman(int number)
    {
        if (number is < 1 or > 3999)
            return string.Empty;
        var result = "";
        foreach (var (value, symbol) in Values)
        {
            while (number >= value)
            {
                result += symbol;
                number -= value;
            }
        }
        return result;
    }

    public static int? FromRoman(string? roman)
    {
        var value = roman?.Trim().ToUpperInvariant() ?? "";
        if (value.Length == 0 || !Pattern.IsMatch(value))
            return null;
        var number = 0;
        var index = 0;
        foreach (var (unit, symbol) in Values)
        {
            while (value[index..].StartsWith(symbol, StringComparison.Ordinal))
            {
                number += unit;
                index += symbol.Length;
                if (index == value.Length)
                    return number;
            }
        }
        return number;
    }
}
