namespace Blog.Blazor.Client.Shared;

public partial class PublishedUpdatedMeta
{
    [Parameter]
    public string? PublishedAt { get; set; }

    [Parameter]
    public string? UpdatedAt { get; set; }

    [Parameter]
    public string? AdditionalText { get; set; }
    private bool ShouldShowUpdated =>
        !string.IsNullOrWhiteSpace(PublishedAt)
        && !string.IsNullOrWhiteSpace(UpdatedAt)
        && DateTime.TryParse(PublishedAt, out var published)
        && DateTime.TryParse(UpdatedAt, out var updated)
        && (updated - published).TotalHours > 24;

    private static string FormatDate(string? value) =>
        DateTime.TryParse(value, out var date)
            ? date.ToString("dd MMM yyyy", CultureInfo.CurrentCulture)
            : value ?? string.Empty;
}
