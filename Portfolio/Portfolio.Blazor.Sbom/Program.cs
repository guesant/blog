using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

if (args.Length != 2)
{
    Console.Error.WriteLine(
        "Usage: Portfolio.Blazor.Sbom <nuget-list-json-file-or-directory> <spdx-output>"
    );
    return 2;
}

var inputPath = Path.GetFullPath(args[0]);
var outputPath = Path.GetFullPath(args[1]);
var inputFiles = Directory.Exists(inputPath)
    ? Directory
        .GetFiles(inputPath, "*.json")
        .OrderBy(path => path, StringComparer.Ordinal)
        .ToArray()
    : [inputPath];
var documents = new List<JsonDocument>();
foreach (var inputFile in inputFiles)
{
    documents.Add(JsonDocument.Parse(await File.ReadAllTextAsync(inputFile)));
}

var packages = documents
    .SelectMany(document => document.RootElement.GetProperty("projects").EnumerateArray())
    .SelectMany(project => project.GetProperty("frameworks").EnumerateArray())
    .SelectMany(framework =>
        EnumeratePackages(framework, "topLevelPackages")
            .Concat(EnumeratePackages(framework, "transitivePackages"))
    )
    .Where(package => package.Id.Length > 0 && package.Version.Length > 0)
    .GroupBy(package => $"{package.Id}@{package.Version}", StringComparer.OrdinalIgnoreCase)
    .Select(group => group.First())
    .OrderBy(package => package.Id, StringComparer.OrdinalIgnoreCase)
    .ThenBy(package => package.Version, StringComparer.OrdinalIgnoreCase)
    .ToArray();

var spdxPackages = packages
    .Select(package =>
    {
        var purl = $"pkg:nuget/{Uri.EscapeDataString(package.Id)}@{package.Version}";
        return new
        {
            SPDXID = SpdxId(purl),
            name = package.Id,
            versionInfo = package.Version,
            downloadLocation = $"https://www.nuget.org/packages/{Uri.EscapeDataString(package.Id)}/{package.Version}",
            filesAnalyzed = false,
            licenseConcluded = "NOASSERTION",
            licenseDeclared = "NOASSERTION",
            externalRefs = new[]
            {
                new
                {
                    referenceCategory = "PACKAGE-MANAGER",
                    referenceType = "purl",
                    referenceLocator = purl,
                },
            },
        };
    })
    .ToArray();

var packageIds = spdxPackages.Select(package => (string)package.SPDXID!).ToArray();
var sbom = new
{
    SPDXID = "SPDXRef-DOCUMENT",
    spdxVersion = "SPDX-2.3",
    dataLicense = "CC0-1.0",
    name = "portfolio-blazor-nuget-dependencies",
    documentNamespace = $"https://example.invalid/portfolio/blazor/sbom/{Sha256(JsonSerializer.Serialize(spdxPackages))}",
    creationInfo = new
    {
        created = DateTimeOffset.UtcNow.ToString("O"),
        creators = new[] { "Tool: Portfolio.Blazor.Sbom" },
    },
    documentDescribes = packageIds,
    packages = spdxPackages,
};

Directory.CreateDirectory(Path.GetDirectoryName(outputPath)!);
await File.WriteAllTextAsync(
    outputPath,
    JsonSerializer.Serialize(sbom, new JsonSerializerOptions { WriteIndented = true })
        + Environment.NewLine
);
Console.WriteLine($"Generated {spdxPackages.Length} NuGet packages at {outputPath}");
return 0;

static IEnumerable<(string Id, string Version)> EnumeratePackages(
    JsonElement framework,
    string propertyName
)
{
    if (!framework.TryGetProperty(propertyName, out var packages))
    {
        yield break;
    }

    foreach (var package in packages.EnumerateArray())
    {
        var id = package.GetProperty("id").GetString() ?? string.Empty;
        var version = package.GetProperty("resolvedVersion").GetString() ?? string.Empty;
        yield return (id, version);
    }
}

static string SpdxId(string value) => $"SPDXRef-{Sha256(value)[..24]}";

static string Sha256(string value)
{
    var hash = SHA256.HashData(Encoding.UTF8.GetBytes(value));
    return Convert.ToHexString(hash).ToLowerInvariant();
}
