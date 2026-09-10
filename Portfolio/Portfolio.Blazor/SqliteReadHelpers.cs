using Microsoft.Data.Sqlite;

namespace Portfolio.Blazor;

internal static class SqliteReadHelpers
{
    internal static Dictionary<string, object?> Row(
        SqliteConnection db,
        string sql,
        params (string Name, object Value)[] parameters
    ) => Rows(db, sql, parameters).FirstOrDefault() ?? [];

    internal static List<Dictionary<string, object?>> Rows(
        SqliteConnection db,
        string sql,
        params (string Name, object Value)[] parameters
    )
    {
        using var command = db.CreateCommand();
        command.CommandText = sql;
        foreach (var parameter in parameters)
            command.Parameters.AddWithValue(parameter.Name, parameter.Value);
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
            ? Convert.ToString(value) ?? fallback
            : fallback;

    internal static bool Bool(Dictionary<string, object?> row, string key) =>
        Text(row, key) is "1" or "true" or "True";
}
