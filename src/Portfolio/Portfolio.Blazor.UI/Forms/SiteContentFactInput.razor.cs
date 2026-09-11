using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.UI.Forms;

public partial class SiteContentFactInput
{
    [Parameter]
    public string? Id { get; set; }

    [Parameter]
    public ContentFactContentType ContentType { get; set; }

    [Parameter]
    public string KnownSectionLabel { get; set; } = "Known fields";

    [Parameter]
    public string FreeFormSectionLabel { get; set; } = "Other fields";

    private string RootId => Id ?? "content-fact-input";

    private IReadOnlyList<ContentFactDefinition> KnownFields =>
        ContentType == ContentFactContentType.None
            ? []
            : ContentFactCatalog.All.Where(fact => fact.ContentTypes.HasFlag(ContentType)).ToList();

    protected override bool IsKnownKey(string key) =>
        KnownFields.Any(fact => string.Equals(fact.Key, key, StringComparison.OrdinalIgnoreCase));

    protected override IEnumerable<string> AllKnownKeys =>
        ContentFactCatalog.All.Select(fact => fact.Key);

    private static string InputType(ContentFactValueKind kind) =>
        kind switch
        {
            ContentFactValueKind.Number => "number",
            ContentFactValueKind.Url => "url",
            ContentFactValueKind.Date => "date",
            _ => "text",
        };

    private string RowId(string key) => $"{RootId}-{key}";
}
