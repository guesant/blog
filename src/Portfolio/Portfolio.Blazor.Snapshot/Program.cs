using Microsoft.Data.Sqlite;

if (args.Length != 2)
{
    Console.Error.WriteLine(
        "usage: Portfolio.Blazor.Snapshot <source.sqlite> <destination.sqlite>"
    );
    return 2;
}

var sourcePath = Path.GetFullPath(args[0]);
var destinationPath = Path.GetFullPath(args[1]);
if (!File.Exists(sourcePath))
{
    Console.Error.WriteLine($"source database was not found: {sourcePath}");
    return 1;
}

if (File.Exists(destinationPath))
{
    Console.Error.WriteLine($"refusing to overwrite an existing snapshot: {destinationPath}");
    return 1;
}

var directory = Path.GetDirectoryName(destinationPath);
if (string.IsNullOrWhiteSpace(directory))
{
    Console.Error.WriteLine("destination must include a directory");
    return 2;
}

Directory.CreateDirectory(directory);
var temporaryPath = Path.Combine(
    directory,
    $".{Path.GetFileName(destinationPath)}.{Guid.NewGuid():N}.tmp"
);
try
{
    var source = new SqliteConnection(
        new SqliteConnectionStringBuilder
        {
            DataSource = sourcePath,
            Mode = SqliteOpenMode.ReadOnly,
        }.ToString()
    );
    var destination = new SqliteConnection(
        new SqliteConnectionStringBuilder
        {
            DataSource = temporaryPath,
            Mode = SqliteOpenMode.ReadWriteCreate,
        }.ToString()
    );
    await source.OpenAsync();
    await destination.OpenAsync();
    source.BackupDatabase(destination);
    await destination.CloseAsync();
    await source.CloseAsync();
    File.Move(temporaryPath, destinationPath);
    Console.WriteLine(destinationPath);
    return 0;
}
catch
{
    if (File.Exists(temporaryPath))
        File.Delete(temporaryPath);
    throw;
}
