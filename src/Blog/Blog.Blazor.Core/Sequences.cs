namespace Blog.Blazor.Core;

public sealed record SequenceResult(
    bool IsValid,
    double ArithmeticTerm,
    double ArithmeticSum,
    double GeometricTerm,
    double GeometricSum,
    double? InfiniteGeometricSum,
    string? Error
);

public static class SequenceCalculator
{
    public const int MaximumTerms = 100_000;

    public static SequenceResult Calculate(double first, double difference, double ratio, int terms)
    {
        if (
            !double.IsFinite(first)
            || !double.IsFinite(difference)
            || !double.IsFinite(ratio)
            || terms < 1
            || terms > MaximumTerms
        )
        {
            return new(false, 0, 0, 0, 0, null, "invalid_input");
        }

        var arithmeticTerm = first + (terms - 1) * difference;
        var arithmeticSum = terms * (first + arithmeticTerm) / 2;
        var geometricTerm = first * Math.Pow(ratio, terms - 1);
        var geometricSum =
            Math.Abs(ratio - 1) < double.Epsilon
                ? terms * first
                : first * (1 - Math.Pow(ratio, terms)) / (1 - ratio);
        double? infiniteSum = Math.Abs(ratio) < 1 ? first / (1 - ratio) : null;

        return new(
            true,
            arithmeticTerm,
            arithmeticSum,
            geometricTerm,
            geometricSum,
            infiniteSum,
            null
        );
    }
}
