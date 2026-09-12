using System.IO.Compression;
using System.Text;

namespace Blog.Blazor.Core;

public static class SnippetArchiveBuilder
{
    public const int MaximumFiles = 100;
    public const int MaximumFileBytes = 2 * 1024 * 1024;
    public const int MaximumArchiveBytes = 10 * 1024 * 1024;

    public static byte[] Build(
        PublicSnippet snippet,
        IReadOnlyCollection<string>? selectedFileIds = null
    )
    {
        ArgumentNullException.ThrowIfNull(snippet);

        var allFiles = snippet.Files ?? [];
        var files = selectedFileIds is { Count: > 0 }
            ? allFiles
                .Where(file =>
                    !string.IsNullOrWhiteSpace(file.Id)
                    && selectedFileIds.Any(id =>
                        string.Equals(id, file.Id, StringComparison.OrdinalIgnoreCase)
                    )
                )
                .ToArray()
            : allFiles.ToArray();
        if (files.Length > MaximumFiles)
        {
            throw new SnippetArchiveException("snippet contains too many files");
        }

        using var archiveStream = new MemoryStream();
        using (var archive = new ZipArchive(archiveStream, ZipArchiveMode.Create, leaveOpen: true))
        {
            var paths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var totalBytes = 0;

            foreach (var file in files)
            {
                var path = NormalizePath(file.Path);
                var content = file.Content ?? string.Empty;
                var bytes = Encoding.UTF8.GetBytes(content);

                if (
                    bytes.Length > MaximumFileBytes
                    || totalBytes > MaximumArchiveBytes - bytes.Length
                )
                {
                    throw new SnippetArchiveException(
                        "snippet files exceed the download size limit"
                    );
                }

                if (!paths.Add(path))
                {
                    throw new SnippetArchiveException("snippet contains duplicate file paths");
                }

                var entry = archive.CreateEntry(path, CompressionLevel.Fastest);
                using var writer = new StreamWriter(
                    entry.Open(),
                    new UTF8Encoding(encoderShouldEmitUTF8Identifier: false)
                );
                writer.Write(content);
                totalBytes += bytes.Length;
            }
        }

        return archiveStream.ToArray();
    }

    private static string NormalizePath(string path)
    {
        if (string.IsNullOrWhiteSpace(path) || path.Contains('\0'))
        {
            throw new SnippetArchiveException("snippet contains an invalid file path");
        }

        var normalized = path.Replace('\\', '/');
        if (normalized.StartsWith('/') || normalized.Contains(':', StringComparison.Ordinal))
        {
            throw new SnippetArchiveException("snippet contains an unsafe file path");
        }

        var segments = normalized.Split('/');
        if (segments.Any(segment => segment is "" or "." or ".."))
        {
            throw new SnippetArchiveException("snippet contains an unsafe file path");
        }

        normalized = string.Join('/', segments);
        return normalized.Length <= 240
            ? normalized
            : throw new SnippetArchiveException("snippet contains an excessively long file path");
    }
}

public sealed class SnippetArchiveException(string message) : Exception(message);
