namespace Portfolio.Blazor.Core;

public readonly record struct DataCleanerResult(
    bool IsValid,
    string Output,
    int InputRows,
    int OutputRows,
    int EmptyRowsRemoved,
    int DuplicateRowsRemoved,
    string? Error = null
);

public static class DataCleaner
{
    public static DataCleanerResult Clean(
        string? csv,
        bool trimCells,
        bool removeEmptyRows,
        bool removeDuplicateRows
    )
    {
        var rows = CsvTable.Parse(csv);
        if (rows.Count == 0)
        {
            return new DataCleanerResult(false, string.Empty, 0, 0, 0, 0, "empty-or-invalid-csv");
        }

        var inputRows = rows.Count;
        List<IReadOnlyList<string>> cleaned = rows.Select(row =>
                (IReadOnlyList<string>)row.Select(cell => trimCells ? cell.Trim() : cell).ToArray()
            )
            .ToList();

        var emptyRowsRemoved = 0;
        if (removeEmptyRows)
        {
            var before = cleaned.Count;
            cleaned = cleaned.Where(row => row.Any(cell => cell.Length > 0)).ToList();
            emptyRowsRemoved = before - cleaned.Count;
        }

        var duplicateRowsRemoved = 0;
        if (removeDuplicateRows)
        {
            var seen = new HashSet<string>(StringComparer.Ordinal);
            var unique = new List<IReadOnlyList<string>>(cleaned.Count);
            foreach (var row in cleaned)
            {
                var key = string.Join('\u001f', row);
                if (seen.Add(key))
                {
                    unique.Add(row);
                }
                else
                {
                    duplicateRowsRemoved++;
                }
            }

            cleaned = unique;
        }

        return new DataCleanerResult(
            true,
            CsvTable.Serialize(cleaned),
            inputRows,
            cleaned.Count,
            emptyRowsRemoved,
            duplicateRowsRemoved
        );
    }
}
