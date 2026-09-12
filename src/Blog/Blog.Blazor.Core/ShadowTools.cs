namespace Blog.Blazor.Core;

public readonly record struct BoxShadowLayer(
    int X,
    int Y,
    int Blur,
    int Spread,
    string Color,
    bool Inset
);

public static class BoxShadowFormatter
{
    public static string Format(IEnumerable<BoxShadowLayer> layers) =>
        $"box-shadow: {string.Join(", ", layers.Select(layer =>
        $"{(layer.Inset ? "inset " : string.Empty)}{layer.X}px {layer.Y}px {Math.Max(0, layer.Blur)}px {layer.Spread}px {NormalizeColor(layer.Color)}"))};";

    private static string NormalizeColor(string color) =>
        string.IsNullOrWhiteSpace(color) ? "#000000" : color;
}
