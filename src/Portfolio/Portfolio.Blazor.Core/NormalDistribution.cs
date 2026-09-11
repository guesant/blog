namespace Portfolio.Blazor.Core;

public readonly record struct NormalDistributionPoint(double X, double Density);

public readonly record struct NormalDistributionResult(
    bool IsValid,
    double Z,
    double CumulativeProbability,
    double Density,
    IReadOnlyList<NormalDistributionPoint> Points
);

public static class NormalDistributionCalculator
{
    public const int ChartPoints = 101;

    public static NormalDistributionResult Analyze(double mean, double deviation, double point)
    {
        if (
            !double.IsFinite(mean)
            || !double.IsFinite(deviation)
            || !double.IsFinite(point)
            || deviation <= 0
        )
        {
            return Invalid();
        }

        var z = (point - mean) / deviation;
        var density = Density(mean, deviation, point);
        var cumulativeProbability = 0.5 * (1 + Erf(z / Math.Sqrt(2)));
        var points = Enumerable
            .Range(0, ChartPoints)
            .Select(index =>
            {
                var x = mean - 4 * deviation + (8 * deviation * index / (ChartPoints - 1));
                return new NormalDistributionPoint(x, Density(mean, deviation, x));
            })
            .ToArray();

        return new NormalDistributionResult(true, z, cumulativeProbability, density, points);
    }

    private static double Density(double mean, double deviation, double value)
    {
        var z = (value - mean) / deviation;
        return Math.Exp(-0.5 * z * z) / (deviation * Math.Sqrt(2 * Math.PI));
    }

    private static double Erf(double value)
    {
        var sign = value < 0 ? -1 : 1;
        var x = Math.Abs(value);
        var t = 1 / (1 + 0.3275911 * x);
        var polynomial =
            (
                ((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t
                + 0.254829592
            ) * t;
        return sign * (1 - polynomial * Math.Exp(-x * x));
    }

    private static NormalDistributionResult Invalid() => new(false, 0, 0, 0, []);
}
