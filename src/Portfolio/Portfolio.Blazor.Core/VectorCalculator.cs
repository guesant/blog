namespace Portfolio.Blazor.Core;

public readonly record struct VectorCalculationResult(
    bool IsValid,
    double Dot,
    double MagnitudeA,
    double MagnitudeB,
    double? AngleRadians,
    IReadOnlyList<double> Cross,
    string? Error = null
);

public static class VectorCalculator
{
    public static VectorCalculationResult Calculate(
        IReadOnlyList<double> a,
        IReadOnlyList<double> b
    )
    {
        if (
            a.Count != 3
            || b.Count != 3
            || a.Any(value => !double.IsFinite(value))
            || b.Any(value => !double.IsFinite(value))
        )
            return Invalid("three_dimensions_required");
        var magnitudeA = Math.Sqrt(a.Sum(value => value * value));
        var magnitudeB = Math.Sqrt(b.Sum(value => value * value));
        var dot = a.Zip(b, (left, right) => left * right).Sum();
        double? angle =
            magnitudeA == 0 || magnitudeB == 0
                ? null
                : Math.Acos(Math.Clamp(dot / (magnitudeA * magnitudeB), -1, 1));
        IReadOnlyList<double> cross =
        [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ];
        return new(true, dot, magnitudeA, magnitudeB, angle, cross);
    }

    private static VectorCalculationResult Invalid(string error) =>
        new(false, 0, 0, 0, null, [], error);
}
