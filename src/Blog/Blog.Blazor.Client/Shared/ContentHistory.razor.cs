using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Shared;

public partial class ContentHistory
{
    [Parameter]
    public bool ShowHistory { get; set; }

    [Parameter]
    public IReadOnlyList<PublicHistoryEntry>? History { get; set; }

    [Parameter]
    public string? DiffField { get; set; }

    [Parameter]
    public IReadOnlyList<string>? DiffFields { get; set; }

    [Parameter]
    public string? PreserveQueryName { get; set; }

    [Parameter]
    public string? PreserveQueryValue { get; set; }

    private static readonly IReadOnlyDictionary<string, object> HistoryLiveAttributes =
        new Dictionary<string, object> { ["aria-live"] = "polite" };

    private IReadOnlyList<HistoryVersion> Versions
    {
        get
        {
            if (History is not { Count: > 0 })
                return [];
            var versions = new List<HistoryVersion>
            {
                new("original", L["original_version"], History[0].Before),
            };
            versions.AddRange(
                History.Select(entry => new HistoryVersion(entry.Id, entry.Label, entry.After))
            );
            return versions;
        }
    }

    private IReadOnlyList<SiteSelectOption> VersionOptions =>
        Versions.Select(version => new SiteSelectOption(version.Id, version.Label)).ToArray();

    private HistoryVersion From =>
        FindVersion(QueryValues().ElementAtOrDefault(0)) ?? Versions.First();
    private HistoryVersion To =>
        FindVersion(QueryValues().ElementAtOrDefault(1)) ?? Versions.Last();
    private IReadOnlyList<ChangeLine> Changes => (
            DiffFields is { Count: > 0 } ? DiffFields
            : string.IsNullOrWhiteSpace(DiffField)
                ? From
                    .Values.Keys.Union(To.Values.Keys, StringComparer.OrdinalIgnoreCase)
                    .OrderBy(key => key)
                    .ToArray()
            : [DiffField]
        ).SelectMany(key => DiffLines(From.Values.GetValueOrDefault(key), To.Values.GetValueOrDefault(key))).ToArray();

    private HistoryVersion? FindVersion(string? id) =>
        Versions.FirstOrDefault(version => version.Id.Equals(id, StringComparison.Ordinal));

    private IReadOnlyList<string> QueryValues() =>
        new Uri(Navigation.Uri)
            .Query.TrimStart('?')
            .Split('&', StringSplitOptions.RemoveEmptyEntries)
            .Select(value => value.Split('=', 2))
            .Where(parts =>
                parts.Length == 2
                && Uri.UnescapeDataString(parts[0])
                    .Equals("compare[]", StringComparison.OrdinalIgnoreCase)
            )
            .Select(parts => Uri.UnescapeDataString(parts[1]))
            .ToArray();

    private sealed record HistoryVersion(
        string Id,
        string Label,
        Dictionary<string, string?> Values
    );

    private static IEnumerable<ChangeLine> DiffLines(string? oldValue, string? newValue)
    {
        if (oldValue == newValue)
            return [];
        var oldLines = (oldValue ?? string.Empty).Split('\n');
        var newLines = (newValue ?? string.Empty).Split('\n');
        var changes = new List<ChangeLine>();
        var oldIndex = 0;
        var newIndex = 0;
        while (oldIndex < oldLines.Length || newIndex < newLines.Length)
        {
            if (
                oldIndex < oldLines.Length
                && newIndex < newLines.Length
                && oldLines[oldIndex] == newLines[newIndex]
            )
            {
                oldIndex++;
                newIndex++;
                continue;
            }

            if (
                oldIndex < oldLines.Length
                && (
                    newIndex >= newLines.Length
                    || !newLines
                        .Skip(newIndex + 1)
                        .Contains(oldLines[oldIndex], StringComparer.Ordinal)
                )
            )
            {
                changes.Add(new ChangeLine("removed", "-", oldLines[oldIndex++]));
            }
            else if (newIndex < newLines.Length)
            {
                changes.Add(new ChangeLine("added", "+", newLines[newIndex++]));
            }
        }
        return changes;
    }

    private sealed record ChangeLine(string Kind, string Marker, string Text);
}
