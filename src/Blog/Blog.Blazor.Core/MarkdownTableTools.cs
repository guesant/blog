namespace Blog.Blazor.Core;

public static class MarkdownTableGenerator
{
    public static string Generate(string? text)
    {
        var rows = (text ?? string.Empty)
            .Split('\n')
            .Select(line => line.TrimEnd('\r'))
            .Where(line => !string.IsNullOrWhiteSpace(line))
            .Select(line =>
                (line.Contains('\t') ? line.Split('\t') : line.Split(','))
                    .Select(cell => cell.Trim())
                    .ToArray()
            )
            .ToArray();
        if (rows.Length == 0)
            return string.Empty;
        var columnCount = rows.Max(row => row.Length);
        var normalized = rows.Select(row =>
                Enumerable
                    .Range(0, columnCount)
                    .Select(index => index < row.Length ? row[index] : string.Empty)
                    .ToArray()
            )
            .ToArray();
        var widths = Enumerable
            .Range(0, columnCount)
            .Select(column => Math.Max(3, normalized.Max(row => row[column].Length)))
            .ToArray();
        static string FormatRow(string[] row, int[] widths) =>
            $"| {string.Join(" | ", row.Select((cell, index) => cell.PadRight(widths[index])))} |";
        var output = new List<string>
        {
            FormatRow(normalized[0], widths),
            $"| {string.Join(" | ", widths.Select(width => new string('-', width)))} |",
        };
        output.AddRange(normalized.Skip(1).Select(row => FormatRow(row, widths)));
        return string.Join('\n', output);
    }
}
