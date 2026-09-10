namespace Portfolio.Blazor.Core;

public enum StatisticsError
{
    None,
    EmptyInput,
    InvalidNumber,
}

public readonly record struct HistogramBin(double Start, double End, int Count);

public readonly record struct StatisticsSummary(
    bool IsValid,
    int Count,
    double Minimum,
    double Maximum,
    double Mean,
    double Median,
    double? Mode,
    double FirstQuartile,
    double ThirdQuartile,
    double PopulationVariance,
    double SampleVariance,
    double PopulationStandardDeviation,
    double SampleStandardDeviation,
    IReadOnlyList<HistogramBin> Histogram,
    StatisticsError Error = StatisticsError.None
)
{
    public double InterquartileRange => ThirdQuartile - FirstQuartile;
}

public static class DescriptiveStatisticsCalculator
{
    public static StatisticsSummary Analyze(string? input, int histogramBinCount = 8)
    {
        var values = Parse(input);
        if (values is null)
        {
            return Invalid(StatisticsError.EmptyInput);
        }

        if (values.Count == 0)
        {
            return Invalid(StatisticsError.EmptyInput);
        }

        var ordered = values.Order().ToArray();
        var mean = ordered.Average();
        var median = Median(ordered);
        var firstQuartile =
            ordered.Length == 1 ? ordered[0] : Median(ordered[..(ordered.Length / 2)]);
        var thirdQuartile =
            ordered.Length == 1 ? ordered[0] : Median(ordered[((ordered.Length + 1) / 2)..]);
        var populationVariance = ordered.Select(value => Math.Pow(value - mean, 2)).Average();
        var sampleVariance =
            ordered.Length > 1
                ? populationVariance * ordered.Length / (ordered.Length - 1)
                : double.NaN;

        return new StatisticsSummary(
            IsValid: true,
            Count: ordered.Length,
            Minimum: ordered[0],
            Maximum: ordered[^1],
            Mean: mean,
            Median: median,
            Mode: FindMode(ordered),
            FirstQuartile: firstQuartile,
            ThirdQuartile: thirdQuartile,
            PopulationVariance: populationVariance,
            SampleVariance: sampleVariance,
            PopulationStandardDeviation: Math.Sqrt(populationVariance),
            SampleStandardDeviation: Math.Sqrt(sampleVariance),
            Histogram: CreateHistogram(ordered, histogramBinCount)
        );
    }

    private static List<double>? Parse(string? input)
    {
        var tokens = input?.Split(
            [',', ';', ' ', '\t', '\r', '\n'],
            StringSplitOptions.RemoveEmptyEntries
        );
        if (tokens is null || tokens.Length == 0)
        {
            return null;
        }

        var values = new List<double>(tokens.Length);
        foreach (var token in tokens)
        {
            if (
                !double.TryParse(
                    token,
                    System.Globalization.NumberStyles.Float,
                    System.Globalization.CultureInfo.InvariantCulture,
                    out var value
                ) || !double.IsFinite(value)
            )
            {
                return null;
            }

            values.Add(value);
        }

        return values;
    }

    private static double Median(IReadOnlyList<double> values)
    {
        if (values.Count == 0)
        {
            return double.NaN;
        }

        var middle = values.Count / 2;
        return values.Count % 2 == 0 ? (values[middle - 1] + values[middle]) / 2 : values[middle];
    }

    private static double? FindMode(IReadOnlyList<double> ordered)
    {
        var groups = ordered
            .GroupBy(value => value)
            .OrderByDescending(group => group.Count())
            .ThenBy(group => group.Key)
            .ToArray();
        return groups.Length > 0 && groups[0].Count() > 1 ? groups[0].Key : null;
    }

    private static IReadOnlyList<HistogramBin> CreateHistogram(
        IReadOnlyList<double> ordered,
        int requestedBinCount
    )
    {
        var binCount = Math.Clamp(requestedBinCount, 1, 32);
        var minimum = ordered[0];
        var maximum = ordered[^1];
        if (minimum == maximum)
        {
            return [new HistogramBin(minimum, maximum, ordered.Count)];
        }

        var width = (maximum - minimum) / binCount;
        var bins = Enumerable
            .Range(0, binCount)
            .Select(index => new HistogramBin(
                minimum + index * width,
                minimum + (index + 1) * width,
                0
            ))
            .ToArray();

        foreach (var value in ordered)
        {
            var index = Math.Min((int)((value - minimum) / width), binCount - 1);
            bins[index] = bins[index] with { Count = bins[index].Count + 1 };
        }

        return bins;
    }

    private static StatisticsSummary Invalid(StatisticsError error) =>
        new(
            IsValid: false,
            Count: 0,
            Minimum: double.NaN,
            Maximum: double.NaN,
            Mean: double.NaN,
            Median: double.NaN,
            Mode: null,
            FirstQuartile: double.NaN,
            ThirdQuartile: double.NaN,
            PopulationVariance: double.NaN,
            SampleVariance: double.NaN,
            PopulationStandardDeviation: double.NaN,
            SampleStandardDeviation: double.NaN,
            Histogram: [],
            Error: error
        );
}
