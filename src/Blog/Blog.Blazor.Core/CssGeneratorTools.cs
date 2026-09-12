namespace Blog.Blazor.Core;

public static class BorderRadiusGenerator
{
    public static string Format(
        int topLeft,
        int topRight,
        int bottomRight,
        int bottomLeft,
        bool linked
    ) =>
        $"border-radius: {Math.Max(0, topLeft)}px {Math.Max(0, linked ? topLeft : topRight)}px {Math.Max(0, linked ? topLeft : bottomRight)}px {Math.Max(0, linked ? topLeft : bottomLeft)}px;";
}
