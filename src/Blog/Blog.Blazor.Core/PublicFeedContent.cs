namespace Blog.Blazor.Core;

public static class PublicFeedContent
{
    public sealed record Entry(string Title, string? Excerpt, string? RawDate, string RelativeUrl);

    public static IReadOnlyList<Entry> Entries(PublicSiteSnapshot snapshot) =>
        snapshot
            .Writings.Select(item => new Entry(item.Title, item.Excerpt, item.Date, item.Url))
            .Concat(
                snapshot
                    .Findings.Where(item => !string.IsNullOrWhiteSpace(item.Title))
                    .Select(item => new Entry(
                        item.Title!,
                        item.PersonalNote ?? item.ReasonFound ?? item.Description,
                        item.FoundDate ?? item.PublishedDate,
                        item.Url
                    ))
            )
            .Concat(
                snapshot.Collections.Select(item => new Entry(
                    item.Title,
                    item.Description,
                    item.CreatedAt,
                    item.Url
                ))
            )
            .ToArray();

    public static bool HasItems(PublicSiteSnapshot snapshot) => Entries(snapshot).Count > 0;
}
