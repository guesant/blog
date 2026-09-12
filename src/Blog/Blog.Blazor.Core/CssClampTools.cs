using System.Globalization;

namespace Blog.Blazor.Core;

public readonly record struct CssClampResult(bool IsValid, string Value);

public static class CssClampEngine
{
    public static CssClampResult Calculate(
        double minSize,
        double maxSize,
        double minViewport,
        double maxViewport
    )
    {
        if (
            !double.IsFinite(minSize)
            || !double.IsFinite(maxSize)
            || !double.IsFinite(minViewport)
            || !double.IsFinite(maxViewport)
            || minViewport >= maxViewport
            || minSize <= 0
            || maxSize <= 0
        )
            return new(false, string.Empty);

        var slope = (maxSize - minSize) / (maxViewport - minViewport);
        var intersection = -minViewport * slope + minSize;
        var minRem = minSize / 16;
        var maxRem = maxSize / 16;
        var intersectionRem = intersection / 16;
        var preferred = $"{Format(intersectionRem)}rem + {Format(slope * 100)}vw";
        return new(true, $"clamp({Format(minRem)}rem, {preferred}, {Format(maxRem)}rem)");
    }

    private static string Format(double value) =>
        JsRound(value).ToString(CultureInfo.InvariantCulture);

    private static double JsRound(double value) => Math.Floor(value * 10000 + 0.5) / 10000;
}
