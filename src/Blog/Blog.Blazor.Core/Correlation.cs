using System.Globalization;

namespace Blog.Blazor.Core;

public enum CorrelationError
{
    None,
    InvalidInput,
    MismatchedLengths,
    ConstantSeries,
}

public readonly record struct CorrelationResult(
    bool IsValid,
    int Count,
    double Correlation,
    double Slope,
    double Intercept,
    double CoefficientOfDetermination,
    IReadOnlyList<(double X, double Y)> Points,
    CorrelationError Error = CorrelationError.None
);

public static class CorrelationCalculator
{
    public const int MaximumPoints = 10_000;
    public const int MaximumInputCharacters = 200_000;

    public static CorrelationResult Analyze(string? xText, string? yText)
    {
        var x = Parse(xText);
        var y = Parse(yText);
        if (x is null || y is null || x.Count < 2 || y.Count < 2)
        {
            return Invalid(CorrelationError.InvalidInput);
        }

        if (x.Count != y.Count)
        {
            return Invalid(CorrelationError.MismatchedLengths);
        }

        if (x.Count > MaximumPoints)
        {
            return Invalid(CorrelationError.InvalidInput);
        }

        var meanX = x.Average();
        var meanY = y.Average();
        var sumXX = x.Sum(value => Math.Pow(value - meanX, 2));
        var sumYY = y.Sum(value => Math.Pow(value - meanY, 2));
        if (sumXX == 0 || sumYY == 0)
        {
            return Invalid(CorrelationError.ConstantSeries);
        }

        var sumXY = x.Zip(y, (xValue, yValue) => (xValue - meanX) * (yValue - meanY)).Sum();
        var correlation = sumXY / Math.Sqrt(sumXX * sumYY);
        var slope = sumXY / sumXX;
        var intercept = meanY - slope * meanX;
        var points = x.Zip(y, (xValue, yValue) => (xValue, yValue)).ToArray();

        return new CorrelationResult(
            true,
            x.Count,
            correlation,
            slope,
            intercept,
            correlation * correlation,
            points
        );
    }

    private static List<double>? Parse(string? text)
    {
        if ((text?.Length ?? 0) > MaximumInputCharacters)
        {
            return null;
        }

        var values = new List<double>();
        foreach (
            var token in (text ?? string.Empty).Split(
                [' ', '\t', '\r', '\n', ',', ';'],
                StringSplitOptions.RemoveEmptyEntries
            )
        )
        {
            if (
                !double.TryParse(
                    token,
                    NumberStyles.Float,
                    CultureInfo.InvariantCulture,
                    out var value
                ) || !double.IsFinite(value)
            )
            {
                return null;
            }

            values.Add(value);
            if (values.Count > MaximumPoints)
            {
                return null;
            }
        }

        return values;
    }

    private static CorrelationResult Invalid(CorrelationError error) =>
        new(false, 0, 0, 0, 0, 0, [], error);
}
