namespace Blog.Blazor.Core;

public readonly record struct GradientStop(string Color, int Position);

public static class CssGradientFormatter
{
    public static string Format(string type, int angle, IEnumerable<GradientStop> stops)
    {
        var values = string.Join(
            ", ",
            stops.Select(stop => $"{stop.Color} {Math.Clamp(stop.Position, 0, 100)}%")
        );
        var gradient =
            type == "radial"
                ? $"radial-gradient(circle, {values})"
                : $"linear-gradient({angle}deg, {values})";
        return $"background: {gradient};";
    }
}
