using System.Globalization;
using System.Text;

namespace Portfolio.Blazor.Core;

public readonly record struct TriangleResult(bool IsValid, string Summary);

public static class TriangleCalculator
{
    public static TriangleResult Calculate(double a, double b, double c)
    {
        if (
            !double.IsFinite(a)
            || !double.IsFinite(b)
            || !double.IsFinite(c)
            || a <= 0
            || b <= 0
            || c <= 0
            || a + b <= c
            || a + c <= b
            || b + c <= a
        )
            return new(false, "");
        var s = (a + b + c) / 2d;
        var area = Math.Sqrt(s * (s - a) * (s - b) * (s - c));
        return new(
            true,
            $"perímetro = {Format(a + b + c)}; área = {Format(area)}; semiperímetro = {Format(s)}"
        );
    }

    private static string Format(double value) =>
        value.ToString("0.######", CultureInfo.InvariantCulture);
}

public static class VigenereCipher
{
    public static string CleanKey(string key) =>
        new(key.Where(char.IsLetter).Select(char.ToLowerInvariant).ToArray());

    public static string Transform(string text, string key, bool decode)
    {
        var clean = CleanKey(key);
        if (clean.Length == 0)
            return "";
        var index = 0;
        return new string(
            text.Select(ch =>
                {
                    if (!char.IsAsciiLetter(ch))
                        return ch;
                    var baseCode = char.IsUpper(ch) ? 'A' : 'a';
                    var shift = clean[index++ % clean.Length] - 'a';
                    if (decode)
                        shift = -shift;
                    return (char)(baseCode + (ch - baseCode + shift + 26) % 26);
                })
                .ToArray()
        );
    }
}

public readonly record struct Utf8Inspection(string Hex, int Bytes, int Characters, int CodePoints);

public static class Utf8Inspector
{
    public static Utf8Inspection Inspect(string text)
    {
        var bytes = Encoding.UTF8.GetBytes(text);
        return new(
            string.Join(" ", bytes.Select(b => b.ToString("x2", CultureInfo.InvariantCulture))),
            bytes.Length,
            text.Length,
            text.EnumerateRunes().Count()
        );
    }
}
