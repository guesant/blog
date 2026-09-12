using System.Globalization;

namespace Blog.Blazor.Core;

public readonly record struct CsvChartPoint(double X, double Y, string Label);

public sealed record CsvParsedTable(
    bool IsValid,
    IReadOnlyList<string> Headers,
    IReadOnlyList<IReadOnlyList<string>> Rows,
    string? Error = null
);

public sealed record CsvChartResult(
    bool IsValid,
    string XLabel,
    string YLabel,
    IReadOnlyList<CsvChartPoint> Points,
    IReadOnlyList<string> Headers,
    IReadOnlyList<IReadOnlyList<string>> TableRows,
    string? Error
);

public static class CsvChartCalculator
{
    public const int MaximumRows = 2_000;

    public static CsvChartResult Analyze(string csv) => BuildChart(ParseTable(csv), 0, 1, null);

    public static CsvParsedTable ParseTable(string csv, char? delimiter = null)
    {
        if (string.IsNullOrWhiteSpace(csv) || csv.Length > CsvTable.MaximumCharacters)
        {
            return new CsvParsedTable(false, [], [], "invalid_input");
        }

        var resolvedDelimiter = delimiter ?? CsvTable.DetectDelimiter(csv);
        var rows = CsvTable.Parse(csv, resolvedDelimiter).Take(MaximumRows).ToArray();
        if (rows.Length == 0)
        {
            return new CsvParsedTable(false, [], [], "invalid_input");
        }

        var headers = rows[0];
        var data = rows.Skip(1).ToArray();
        if (headers.Count < 2 || data.Length == 0)
        {
            return new CsvParsedTable(false, [], [], "need_two_columns");
        }

        return new CsvParsedTable(true, headers, data);
    }

    public static CsvChartResult BuildChart(
        CsvParsedTable table,
        int xIndex,
        int yIndex,
        string? filter
    )
    {
        if (!table.IsValid)
        {
            return Invalid(table.Error ?? "invalid_input");
        }

        var xIdx = Math.Clamp(xIndex, 0, table.Headers.Count - 1);
        var yIdx = Math.Clamp(yIndex, 0, table.Headers.Count - 1);
        var needle = filter?.Trim().ToLowerInvariant() ?? string.Empty;
        var filteredRows = string.IsNullOrEmpty(needle)
            ? table.Rows
            : table
                .Rows.Where(row =>
                    row.Any(cell =>
                        cell.ToLowerInvariant().Contains(needle, StringComparison.Ordinal)
                    )
                )
                .ToArray();

        var points = filteredRows
            .Select(
                (row, index) =>
                {
                    var x = TryNumber(SafeGet(row, xIdx)) ?? index + 1;
                    var y = TryNumber(SafeGet(row, yIdx));
                    return y.HasValue
                        ? new CsvChartPoint(x, y.Value, SafeGet(row, xIdx))
                        : (CsvChartPoint?)null;
                }
            )
            .Where(point => point.HasValue)
            .Select(point => point!.Value)
            .ToArray();

        return points.Length < 1
            ? Invalid("need_numeric_y")
            : new CsvChartResult(
                true,
                table.Headers[xIdx],
                table.Headers[yIdx],
                points,
                table.Headers,
                filteredRows,
                null
            );
    }

    private static string SafeGet(IReadOnlyList<string> row, int index) =>
        index >= 0 && index < row.Count ? row[index] : string.Empty;

    private static double? TryNumber(string value) =>
        double.TryParse(
            value.Trim(),
            NumberStyles.Float,
            CultureInfo.InvariantCulture,
            out var result
        ) && double.IsFinite(result)
            ? result
            : null;

    private static CsvChartResult Invalid(string error) =>
        new(false, string.Empty, string.Empty, [], [], [], error);
}
