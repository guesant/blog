namespace Blog.Blazor.Core;

public readonly record struct ContrastResult(
    bool IsValid,
    string Foreground,
    string Background,
    double Ratio
)
{
    public bool Passes(double threshold) => IsValid && Ratio >= threshold;
}

public static class ContrastRatioCalculator
{
    public static ContrastResult Calculate(string? foreground, string? background)
    {
        if (!TryParseHex(foreground, out var fg) || !TryParseHex(background, out var bg))
            return new(false, foreground ?? string.Empty, background ?? string.Empty, 0);
        var foregroundLuminance = RelativeLuminance(fg);
        var backgroundLuminance = RelativeLuminance(bg);
        var lighter = Math.Max(foregroundLuminance, backgroundLuminance);
        var darker = Math.Min(foregroundLuminance, backgroundLuminance);
        return new(true, ToHex(fg), ToHex(bg), (lighter + 0.05) / (darker + 0.05));
    }

    private static bool TryParseHex(string? value, out (int R, int G, int B) rgb)
    {
        var hex = value?.Trim().TrimStart('#');
        if (hex is not { Length: 6 } || !hex.All(Uri.IsHexDigit))
        {
            rgb = default;
            return false;
        }
        rgb = (
            Convert.ToInt32(hex[..2], 16),
            Convert.ToInt32(hex[2..4], 16),
            Convert.ToInt32(hex[4..], 16)
        );
        return true;
    }

    private static double RelativeLuminance((int R, int G, int B) rgb) =>
        0.2126 * ChannelToLinear(rgb.R)
        + 0.7152 * ChannelToLinear(rgb.G)
        + 0.0722 * ChannelToLinear(rgb.B);

    private static double ChannelToLinear(int channel)
    {
        var value = channel / 255d;
        return value <= 0.03928 ? value / 12.92 : Math.Pow((value + 0.055) / 1.055, 2.4);
    }

    private static string ToHex((int R, int G, int B) rgb) => $"#{rgb.R:x2}{rgb.G:x2}{rgb.B:x2}";
}
