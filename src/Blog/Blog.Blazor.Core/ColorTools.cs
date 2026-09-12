using System.Globalization;
using System.Text.RegularExpressions;

namespace Blog.Blazor.Core;

public readonly record struct ColorConversionResult(
    bool IsValid,
    bool HasInput,
    int Red,
    int Green,
    int Blue,
    string Hex,
    string Rgb,
    string Hsl
)
{
    public string CssColor => IsValid ? Rgb : "transparent";
}

public static partial class ColorConversionCalculator
{
    public static ColorConversionResult Convert(string? input)
    {
        var value = input?.Trim() ?? string.Empty;
        if (value.Length == 0)
            return new(false, false, 0, 0, 0, string.Empty, string.Empty, string.Empty);

        var rgb = ParseHex(value) ?? ParseRgb(value) ?? ParseHsl(value);
        if (rgb is null)
            return new(false, true, 0, 0, 0, string.Empty, string.Empty, string.Empty);

        var (red, green, blue) = rgb.Value;
        var hsl = RgbToHsl(red, green, blue);
        return new(
            true,
            true,
            red,
            green,
            blue,
            $"#{red:x2}{green:x2}{blue:x2}",
            $"rgb({red}, {green}, {blue})",
            $"hsl({hsl.H}, {hsl.S}%, {hsl.L}%)"
        );
    }

    private static (int Red, int Green, int Blue)? ParseHex(string value)
    {
        var match = HexPattern().Match(value);
        if (!match.Success)
            return null;
        var hex = match.Groups[1].Value;
        if (hex.Length == 3)
            hex = string.Concat(hex.Select(character => $"{character}{character}"));
        return (
            int.Parse(hex[..2], NumberStyles.HexNumber, CultureInfo.InvariantCulture),
            int.Parse(hex[2..4], NumberStyles.HexNumber, CultureInfo.InvariantCulture),
            int.Parse(hex[4..], NumberStyles.HexNumber, CultureInfo.InvariantCulture)
        );
    }

    private static (int Red, int Green, int Blue)? ParseRgb(string value)
    {
        var match = RgbPattern().Match(value);
        if (!match.Success)
            return null;
        var red = int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture);
        var green = int.Parse(match.Groups[2].Value, CultureInfo.InvariantCulture);
        var blue = int.Parse(match.Groups[3].Value, CultureInfo.InvariantCulture);
        return red > 255 || green > 255 || blue > 255 ? null : (red, green, blue);
    }

    private static (int Red, int Green, int Blue)? ParseHsl(string value)
    {
        var match = HslPattern().Match(value);
        if (!match.Success)
            return null;
        var hue = int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture) % 360;
        var saturation = Math.Min(
            100,
            int.Parse(match.Groups[2].Value, CultureInfo.InvariantCulture)
        );
        var lightness = Math.Min(
            100,
            int.Parse(match.Groups[3].Value, CultureInfo.InvariantCulture)
        );
        return HslToRgb(hue, saturation, lightness);
    }

    private static (int Red, int Green, int Blue) HslToRgb(int hue, int saturation, int lightness)
    {
        var sat = saturation / 100d;
        var light = lightness / 100d;
        var chroma = (1 - Math.Abs(2 * light - 1)) * sat;
        var x = chroma * (1 - Math.Abs(hue / 60d % 2 - 1));
        var match = light - chroma / 2;
        var (red, green, blue) = hue switch
        {
            < 60 => (chroma, x, 0d),
            < 120 => (x, chroma, 0d),
            < 180 => (0d, chroma, x),
            < 240 => (0d, x, chroma),
            < 300 => (x, 0d, chroma),
            _ => (chroma, 0d, x),
        };
        return (
            RoundByte((red + match) * 255),
            RoundByte((green + match) * 255),
            RoundByte((blue + match) * 255)
        );
    }

    private static (int H, int S, int L) RgbToHsl(int red, int green, int blue)
    {
        var r = red / 255d;
        var g = green / 255d;
        var b = blue / 255d;
        var max = Math.Max(r, Math.Max(g, b));
        var min = Math.Min(r, Math.Min(g, b));
        var delta = max - min;
        var hue = 0d;
        if (delta != 0)
        {
            hue =
                max == r ? (g - b) / delta % 6
                : max == g ? (b - r) / delta + 2
                : (r - g) / delta + 4;
            hue *= 60;
            if (hue < 0)
                hue += 360;
        }
        var lightness = (max + min) / 2;
        var saturation = delta == 0 ? 0 : delta / (1 - Math.Abs(2 * lightness - 1));
        return (RoundByte(hue), RoundByte(saturation * 100), RoundByte(lightness * 100));
    }

    private static int RoundByte(double value) => (int)Math.Floor(value + 0.5);

    [GeneratedRegex("^#?([0-9a-f]{3}|[0-9a-f]{6})$", RegexOptions.IgnoreCase)]
    private static partial Regex HexPattern();

    [GeneratedRegex(
        "^rgba?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*(?:,\\s*[\\d.]+\\s*)?\\)$",
        RegexOptions.IgnoreCase
    )]
    private static partial Regex RgbPattern();

    [GeneratedRegex(
        "^hsla?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})%\\s*,\\s*(\\d{1,3})%\\s*(?:,\\s*[\\d.]+\\s*)?\\)$",
        RegexOptions.IgnoreCase
    )]
    private static partial Regex HslPattern();
}
