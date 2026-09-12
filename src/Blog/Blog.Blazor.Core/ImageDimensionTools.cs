namespace Blog.Blazor.Core;

public sealed record ImageDimensionResult(bool IsValid, int? Width, int? Height)
{
    public static ImageDimensionResult Empty => new(false, null, null);
}

public static class ImageDimensionCalculator
{
    public static ImageDimensionResult Calculate(
        int originalWidth,
        int originalHeight,
        int? targetWidth,
        int? targetHeight
    )
    {
        if (originalWidth <= 0 || originalHeight <= 0)
            return ImageDimensionResult.Empty;
        if (targetWidth is > 0)
        {
            var height = Math.Max(
                1,
                (int)
                    Math.Round(
                        targetWidth.Value * (double)originalHeight / originalWidth,
                        MidpointRounding.ToEven
                    )
            );
            return new(true, targetWidth, height);
        }
        if (targetHeight is > 0)
        {
            var width = Math.Max(
                1,
                (int)
                    Math.Round(
                        targetHeight.Value * (double)originalWidth / originalHeight,
                        MidpointRounding.ToEven
                    )
            );
            return new(true, width, targetHeight);
        }
        return ImageDimensionResult.Empty;
    }
}
