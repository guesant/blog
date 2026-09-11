using System.Data.Common;
using System.Globalization;

namespace Portfolio.Blazor;

internal static class SqlReadHelpers
{
    internal static Dictionary<string, object?> Row(
        DbConnection db,
        string sql,
        params (string Name, object Value)[] parameters
    ) => Rows(db, sql, parameters).FirstOrDefault() ?? [];

    internal static List<Dictionary<string, object?>> Rows(
        DbConnection db,
        string sql,
        params (string Name, object Value)[] parameters
    )
    {
        using var command = db.CreateCommand();
        command.CommandText = sql;
        foreach (var (name, value) in parameters)
        {
            var parameter = command.CreateParameter();
            parameter.ParameterName = name;
            parameter.Value = value ?? DBNull.Value;
            command.Parameters.Add(parameter);
        }
        using var reader = command.ExecuteReader();
        var result = new List<Dictionary<string, object?>>();
        while (reader.Read())
        {
            var row = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
            for (var i = 0; i < reader.FieldCount; i++)
                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
            result.Add(row);
        }
        return result;
    }

    internal static string Text(
        Dictionary<string, object?> row,
        string key,
        string fallback = ""
    ) =>
        row.TryGetValue(key, out var value) && value is not null
            ? value switch
            {
                DateTime dateTime => dateTime.ToString(
                    "yyyy-MM-dd HH:mm:ss",
                    CultureInfo.InvariantCulture
                ),
                DateOnly dateOnly => dateOnly.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                _ => Convert.ToString(value, CultureInfo.InvariantCulture) ?? fallback,
            }
            : fallback;

    internal static bool Bool(Dictionary<string, object?> row, string key) =>
        row.TryGetValue(key, out var value) && value is bool flag
            ? flag
            : Text(row, key) is "1" or "true" or "True";

    internal static long Id(Dictionary<string, object?> row, string key) =>
        row.TryGetValue(key, out var value) && value is not null
            ? Convert.ToInt64(value, CultureInfo.InvariantCulture)
            : 0;

    internal static string Date(Dictionary<string, object?> row, string key) =>
        row.TryGetValue(key, out var value) switch
        {
            true when value is DateTime dateTime => dateTime.ToString(
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture
            ),
            true when value is DateOnly dateOnly => dateOnly.ToString(
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture
            ),
            true when value is string text => DateTime.TryParse(
                text,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var parsed
            )
                ? parsed.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)
                : text,
            _ => Text(row, key),
        };

    internal static string Timestamp(
        Dictionary<string, object?> row,
        string key,
        string fallback = ""
    ) => Text(row, key, fallback);
}
