using System.Text;

namespace Blog.Blazor.Core;

public static class CsvTable
{
    public const int MaximumRows = 100;
    public const int MaximumColumns = 30;
    public const int MaximumCharacters = 200_000;

    private static readonly char[] DelimiterCandidates = [',', ';', '\t', '|'];

    public static char DetectDelimiter(string? csv)
    {
        var text = csv ?? string.Empty;
        var best = DelimiterCandidates[0];
        var bestCount = -1;
        foreach (var candidate in DelimiterCandidates)
        {
            var count = text.Count(character => character == candidate);
            if (count >= bestCount)
            {
                bestCount = count;
                best = candidate;
            }
        }

        return best;
    }

    public static IReadOnlyList<IReadOnlyList<string>> Parse(string? csv) =>
        Parse(csv, DetectDelimiter(csv));

    public static IReadOnlyList<IReadOnlyList<string>> Parse(string? csv, char delimiter)
    {
        var text = csv ?? string.Empty;
        if (text.Length > MaximumCharacters)
        {
            return [];
        }

        var rows = new List<IReadOnlyList<string>>();
        var row = new List<string>();
        var cell = new StringBuilder();
        var quoted = false;
        for (var index = 0; index < text.Length; index++)
        {
            var character = text[index];
            if (character == '"')
            {
                if (quoted && index + 1 < text.Length && text[index + 1] == '"')
                {
                    cell.Append('"');
                    index++;
                }
                else
                {
                    quoted = !quoted;
                }
            }
            else if (character == delimiter && !quoted)
            {
                row.Add(cell.ToString().Trim());
                cell.Clear();
            }
            else if ((character == '\n' || character == '\r') && !quoted)
            {
                if (character == '\r' && index + 1 < text.Length && text[index + 1] == '\n')
                {
                    index++;
                }

                row.Add(cell.ToString().Trim());
                cell.Clear();
                AddRow(rows, row);
                row = new List<string>();
                if (rows.Count >= MaximumRows)
                {
                    break;
                }
            }
            else
            {
                cell.Append(character);
            }
        }

        if (
            rows.Count < MaximumRows
            && (cell.Length > 0 || row.Count > 0 || text.EndsWith(delimiter))
        )
        {
            row.Add(cell.ToString().Trim());
            AddRow(rows, row);
        }

        return rows;
    }

    public static string Serialize(IReadOnlyList<IReadOnlyList<string>> rows)
    {
        var builder = new StringBuilder();
        foreach (var row in rows.Take(MaximumRows))
        {
            builder.AppendJoin(',', row.Take(MaximumColumns).Select(Escape));
            builder.AppendLine();
        }

        return builder.ToString();
    }

    private static void AddRow(List<IReadOnlyList<string>> rows, List<string> row)
    {
        if (row.Count > 0)
        {
            rows.Add(row.Take(MaximumColumns).ToArray());
        }
    }

    private static string Escape(string value) =>
        value.Contains(',', StringComparison.Ordinal)
        || value.Contains('"')
        || value.Contains('\n')
        || value.Contains('\r')
            ? $"\"{value.Replace("\"", "\"\"", StringComparison.Ordinal)}\""
            : value;
}
