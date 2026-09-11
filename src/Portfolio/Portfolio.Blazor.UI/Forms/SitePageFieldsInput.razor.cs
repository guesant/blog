using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.UI.Forms;

public partial class SitePageFieldsInput
{
    [Parameter]
    public string? Id { get; set; }

    [Parameter]
    public PageFieldSlug Slug { get; set; }

    [Parameter]
    public string Locale { get; set; } = "en";

    [Parameter]
    public string KnownSectionLabel { get; set; } = "Known fields";

    [Parameter]
    public string FreeFormSectionLabel { get; set; } = "Other fields";

    private string RootId => Id ?? "page-fields-input";

    private IReadOnlyList<PageFieldDefinition> KnownFields =>
        Slug == PageFieldSlug.None
            ? []
            : PageFieldCatalog.All.Where(entry => entry.Slugs.HasFlag(Slug)).ToList();

    protected override bool IsKnownKey(string key) =>
        KnownFields.Any(entry => string.Equals(entry.Key, key, StringComparison.OrdinalIgnoreCase));

    protected override IEnumerable<string> AllKnownKeys =>
        PageFieldCatalog.All.Select(entry => entry.Key);

    private string RowId(string key) => $"{RootId}-{key}";
}
