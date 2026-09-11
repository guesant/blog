using System.Globalization;
using Microsoft.Data.Sqlite;
using Npgsql;
using NpgsqlTypes;

if (args.Length != 2)
{
    Console.Error.WriteLine(
        "usage: Portfolio.Blazor.Import <source.sqlite> <postgres connection string>"
    );
    return 2;
}

var sqlitePath = args[0];
if (!File.Exists(sqlitePath))
{
    Console.Error.WriteLine($"source file not found: {sqlitePath}");
    return 2;
}

var sourceConnectionString = new SqliteConnectionStringBuilder
{
    DataSource = sqlitePath,
    Mode = SqliteOpenMode.ReadOnly,
}.ToString();

await using var source = new SqliteConnection(sourceConnectionString);
await source.OpenAsync();
await using var target = new NpgsqlConnection(args[1]);
await target.OpenAsync();

var sourceTables = await Importer.SourceTablesAsync(source);
var targetTables = await Importer.TargetTablesAsync(target);
var onlySource = sourceTables.Except(targetTables, StringComparer.Ordinal).ToList();
var onlyTarget = targetTables.Except(sourceTables, StringComparer.Ordinal).ToList();
if (onlySource.Count > 0 || onlyTarget.Count > 0)
{
    Console.Error.WriteLine(
        $"table sets differ. only in sqlite: [{string.Join(", ", onlySource)}]; only in postgres: [{string.Join(", ", onlyTarget)}]"
    );
    return 1;
}

var nonEmpty = new List<string>();
foreach (var table in targetTables)
{
    if (await Importer.HasRowsAsync(target, table))
    {
        nonEmpty.Add(table);
    }
}
if (nonEmpty.Count > 0)
{
    Console.Error.WriteLine($"target database is not empty: [{string.Join(", ", nonEmpty)}]");
    return 1;
}

var counts = new List<(string Table, long Rows)>();
await using (var transaction = await target.BeginTransactionAsync())
{
    await Importer.ExecuteAsync(target, "set session_replication_role = replica");
    foreach (var table in sourceTables)
    {
        var rows = await Importer.CopyTableAsync(source, target, table);
        counts.Add((table, rows));
    }
    await Importer.ResetIdentitiesAsync(target);
    await transaction.CommitAsync();
}

foreach (var (table, rows) in counts)
{
    var targetRows = await Importer.CountAsync(target, table);
    var marker = rows == targetRows ? "ok" : "MISMATCH";
    Console.WriteLine($"{table, -45} {rows, 8} {targetRows, 8} {marker}");
    if (rows != targetRows)
    {
        return 1;
    }
}

return 0;

internal static class Importer
{
    private static readonly string[] SkippedTables =
    [
        "__EFMigrationsHistory",
        "__EFMigrationsLock",
        "sqlite_sequence",
    ];

    public static async Task<List<string>> SourceTablesAsync(SqliteConnection source)
    {
        var tables = new List<string>();
        await using var command = source.CreateCommand();
        command.CommandText = "select name from sqlite_master where type = 'table' order by name";
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var name = reader.GetString(0);
            if (!SkippedTables.Contains(name, StringComparer.Ordinal))
            {
                tables.Add(name);
            }
        }
        return tables;
    }

    public static async Task<List<string>> TargetTablesAsync(NpgsqlConnection target)
    {
        var tables = new List<string>();
        await using var command = new NpgsqlCommand(
            "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name",
            target
        );
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var name = reader.GetString(0);
            if (!SkippedTables.Contains(name, StringComparer.Ordinal))
            {
                tables.Add(name);
            }
        }
        return tables;
    }

    public static async Task<bool> HasRowsAsync(NpgsqlConnection target, string table)
    {
        await using var command = new NpgsqlCommand(
            $"select exists (select 1 from {Quote(table)})",
            target
        );
        return (bool)(await command.ExecuteScalarAsync())!;
    }

    public static async Task<long> CountAsync(NpgsqlConnection target, string table)
    {
        await using var command = new NpgsqlCommand($"select count(*) from {Quote(table)}", target);
        return (long)(await command.ExecuteScalarAsync())!;
    }

    public static async Task ExecuteAsync(NpgsqlConnection target, string sql)
    {
        await using var command = new NpgsqlCommand(sql, target);
        await command.ExecuteNonQueryAsync();
    }

    public static async Task<long> CopyTableAsync(
        SqliteConnection source,
        NpgsqlConnection target,
        string table
    )
    {
        var columns = await TargetColumnsAsync(target, table);
        await using var select = source.CreateCommand();
        select.CommandText =
            $"select {string.Join(", ", columns.Select(c => Quote(c.Name)))} from {Quote(table)} order by rowid";
        await using var reader = await select.ExecuteReaderAsync();
        var columnList = string.Join(", ", columns.Select(c => Quote(c.Name)));
        await using var writer = await target.BeginBinaryImportAsync(
            $"copy {Quote(table)} ({columnList}) from stdin (format binary)"
        );
        long rows = 0;
        while (await reader.ReadAsync())
        {
            await writer.StartRowAsync();
            for (var i = 0; i < columns.Count; i++)
            {
                if (await reader.IsDBNullAsync(i))
                {
                    await writer.WriteNullAsync();
                    continue;
                }
                await WriteValueAsync(writer, columns[i], reader.GetValue(i), table);
            }
            rows++;
        }
        await writer.CompleteAsync();
        return rows;
    }

    public static async Task ResetIdentitiesAsync(NpgsqlConnection target)
    {
        var identities = new List<(string Table, string Column)>();
        await using (
            var command = new NpgsqlCommand(
                "select table_name, column_name from information_schema.columns where table_schema = 'public' and is_identity = 'YES'",
                target
            )
        )
        await using (var reader = await command.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                identities.Add((reader.GetString(0), reader.GetString(1)));
            }
        }
        foreach (var (table, column) in identities)
        {
            await ExecuteAsync(
                target,
                $"select setval(pg_get_serial_sequence('{Quote(table)}', '{column}'), coalesce((select max({Quote(column)}) from {Quote(table)}), 0) + 1, false)"
            );
        }
    }

    private static async Task<List<TargetColumn>> TargetColumnsAsync(
        NpgsqlConnection target,
        string table
    )
    {
        var columns = new List<TargetColumn>();
        await using var command = new NpgsqlCommand(
            "select column_name, data_type from information_schema.columns where table_schema = 'public' and table_name = @table order by ordinal_position",
            target
        );
        command.Parameters.AddWithValue("table", table);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            columns.Add(new TargetColumn(reader.GetString(0), reader.GetString(1)));
        }
        return columns;
    }

    private static async Task WriteValueAsync(
        NpgsqlBinaryImporter writer,
        TargetColumn column,
        object value,
        string table
    )
    {
        switch (column.DataType)
        {
            case "integer":
                await writer.WriteAsync(
                    Convert.ToInt32(value, CultureInfo.InvariantCulture),
                    NpgsqlDbType.Integer
                );
                break;
            case "bigint":
                await writer.WriteAsync(
                    Convert.ToInt64(value, CultureInfo.InvariantCulture),
                    NpgsqlDbType.Bigint
                );
                break;
            case "boolean":
                await writer.WriteAsync(ToBoolean(value), NpgsqlDbType.Boolean);
                break;
            case "text":
                await writer.WriteAsync(
                    Convert.ToString(value, CultureInfo.InvariantCulture)!,
                    NpgsqlDbType.Text
                );
                break;
            case "character varying":
                await writer.WriteAsync(
                    Convert.ToString(value, CultureInfo.InvariantCulture)!,
                    NpgsqlDbType.Varchar
                );
                break;
            case "date":
                await writer.WriteAsync(ToDate(value, table, column.Name), NpgsqlDbType.Date);
                break;
            case "timestamp without time zone":
                await writer.WriteAsync(
                    ToTimestamp(value, table, column.Name),
                    NpgsqlDbType.Timestamp
                );
                break;
            default:
                throw new InvalidOperationException(
                    $"unsupported target type {column.DataType} on {table}.{column.Name}"
                );
        }
    }

    private static bool ToBoolean(object value) =>
        value switch
        {
            long number => number != 0,
            string text => text is "1" or "true" or "TRUE",
            _ => Convert.ToBoolean(value, CultureInfo.InvariantCulture),
        };

    private static DateOnly ToDate(object value, string table, string column)
    {
        var text = Convert.ToString(value, CultureInfo.InvariantCulture)!.Trim();
        if (
            text.Length >= 10
            && DateOnly.TryParseExact(
                text[..10],
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var date
            )
        )
        {
            return date;
        }
        throw new InvalidOperationException($"unparseable date '{text}' on {table}.{column}");
    }

    private static DateTime ToTimestamp(object value, string table, string column)
    {
        var text = Convert.ToString(value, CultureInfo.InvariantCulture)!.Trim();
        if (
            DateTime.TryParse(
                text,
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                out var parsed
            )
        )
        {
            return DateTime.SpecifyKind(parsed, DateTimeKind.Unspecified);
        }
        throw new InvalidOperationException($"unparseable timestamp '{text}' on {table}.{column}");
    }

    private static string Quote(string identifier) =>
        $"\"{identifier.Replace("\"", "\"\"", StringComparison.Ordinal)}\"";

    private sealed record TargetColumn(string Name, string DataType);
}
