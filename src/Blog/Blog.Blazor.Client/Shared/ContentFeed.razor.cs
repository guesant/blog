using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Shared;

public partial class ContentFeed
{
    private const int PageSize = 20;

    [Parameter]
    public string? QueryKind { get; set; }

    [Parameter]
    public string? QueryTopic { get; set; }

    [Parameter]
    public string? QuerySearch { get; set; }

    [Parameter]
    public string? QuerySort { get; set; }

    [Parameter]
    public string? QueryView { get; set; }

    [Parameter]
    public int? QueryPage { get; set; }

    // IMPORTANT: /writing, /findings and /collections are this same feed with the kind pinned by the
    // route instead of the query string, so "clear filters" keeps the visitor on the section they
    // chose in the sidebar instead of dropping them back on the unfiltered home.
    private string? FixedKind =>
        RequestPath
            .TrimEnd('/')
            .Split('/', StringSplitOptions.RemoveEmptyEntries)
            .LastOrDefault()
            ?.ToLowerInvariant() switch
        {
            "writing" => FeedUrls.Writing,
            "findings" => FeedUrls.Finding,
            "collections" => FeedUrls.Collection,
            _ => null,
        };
    private string FixedRoute =>
        FixedKind switch
        {
            FeedUrls.Writing => "writing",
            FeedUrls.Finding => "findings",
            FeedUrls.Collection => "collections",
            _ => string.Empty,
        };
    private string FixedPageSlug =>
        FixedKind switch
        {
            FeedUrls.Writing => "writing",
            FeedUrls.Finding => "achados",
            _ => "collections",
        };
    private string Action =>
        FixedKind is null ? LocalizedUrls.Current("/") : FeedUrls.ForKind(FixedKind);
    private string CanonicalPath => Action;
    private string Headline =>
        FixedKind is null
            ? Text("manchete", L["home_headline"])
            : PageText(FixedPageSlug, "title", KindLabel(FixedKind));
    private string Subline =>
        FixedKind is null
            ? Text("sub", L["home_subline"])
            : PageText(FixedPageSlug, "description", string.Empty);
    private string ActiveKind =>
        FixedKind ?? (string.IsNullOrWhiteSpace(QueryKind) ? "all" : QueryKind!.Trim());
    private string ActiveTopic => QueryTopic?.Trim() ?? string.Empty;
    private string ActiveSearch => QuerySearch?.Trim() ?? string.Empty;
    private string ActiveSort => QuerySort is "asc" or "alpha" ? QuerySort : "desc";
    private string _kindValue = "all";
    private string _topicValue = string.Empty;
    private string _sortValue = "desc";
    private string SortValue
    {
        get => _sortValue;
        set => _sortValue = value is "asc" or "alpha" ? value : "desc";
    }
    private IReadOnlyList<SiteSelectOption> SortSelectOptions =>
        [
            new("desc", L["newest"], "arrow-down-wide-narrow"),
            new("asc", L["oldest"], "arrow-up-narrow-wide"),
            new("alpha", L["alphabetical"], "arrow-down-a-z"),
        ];
    private string PendingSearch { get; set; } = string.Empty;
    private string KindValue
    {
        get => _kindValue;
        set => _kindValue = value is "all" or "post" or "achado" or "colecao" ? value : "all";
    }
    private string TopicValue
    {
        get => _topicValue;
        set =>
            _topicValue = TopicOptions.Contains(value, StringComparer.OrdinalIgnoreCase)
                ? value
                : string.Empty;
    }
    private IReadOnlyList<SiteSelectOption> KindSelectOptions =>
        [
            new("all", Text("filter_all", L["all"]), "layers"),
            new("post", KindLabel("post"), KindIcon("post")),
            new("achado", KindLabel("achado"), KindIcon("achado")),
            new("colecao", KindLabel("colecao"), KindIcon("colecao")),
        ];
    private IReadOnlyList<SiteSelectOption> TopicSelectOptions =>
        TopicOptions
            .Select(topic => new SiteSelectOption(topic, topic))
            .Prepend(new SiteSelectOption("", Text("filter_all_topics", L["all_topics"])))
            .ToArray();
    private string ViewMode =>
        QueryView?.Equals("dense", StringComparison.OrdinalIgnoreCase) == true
            ? "dense"
            : "spacious";
    private bool DenseView => ViewMode.Equals("dense", StringComparison.OrdinalIgnoreCase);
    private const int PreviewCharacters = 800;

    private static (string Text, bool Truncated) Preview(params string?[] sources)
    {
        var source = sources.FirstOrDefault(value => !string.IsNullOrWhiteSpace(value));
        return PlainTextExcerpt.From(source, PreviewCharacters);
    }

    private static string FormatListDate(string? value) =>
        DateTime.TryParse(value, out var date) ? date.ToString("yyyy-MM-dd") : "·";

    private static string FormatHumanDate(string value) =>
        DateTime.TryParse(value, out var date)
            ? date.ToString("dd MMM yyyy", CultureInfo.CurrentCulture)
            : "·";

    private IReadOnlyList<FeedEntry> AllFeedItems =>
        Snapshot is null
            ? []
            : Snapshot
                .Writings.Select(item => new FeedEntry(
                    "post",
                    item.Url,
                    item.Title,
                    Preview(item.Body, item.Excerpt),
                    FormatListDate(item.Date),
                    item.ReadingTime,
                    null,
                    null,
                    item.Topics?.Where(topic => !string.IsNullOrWhiteSpace(topic.Name))
                        .Select(topic => new TopicLink(topic.Name!, topic.Url))
                        .ToArray()
                        ?? []
                ))
                .Concat(
                    Snapshot.Findings.Select(item => new FeedEntry(
                        "achado",
                        item.Url,
                        item.Title ?? item.Slug,
                        Preview(item.PersonalNote, item.ReasonFound, item.Description),
                        FormatListDate(item.FoundDate ?? item.PublishedDate),
                        null,
                        item.Links?.FirstOrDefault(link => link.IsPrimary)?.Url
                            ?? item.Links?.FirstOrDefault()?.Url,
                        item.Links?.FirstOrDefault(link => link.IsPrimary)?.Platform
                            ?? item.Links?.FirstOrDefault()?.Platform,
                        item.Topics?.Where(topic => !string.IsNullOrWhiteSpace(topic.Name))
                            .Select(topic => new TopicLink(topic.Name!, topic.Url))
                            .ToArray()
                            ?? []
                    ))
                )
                .Concat(
                    Snapshot.Collections.Select(item => new FeedEntry(
                        "colecao",
                        item.Url,
                        item.Title,
                        Preview(item.Intro, item.Description),
                        FormatListDate(item.CreatedAt),
                        null,
                        null,
                        null,
                        []
                    ))
                )
                .OrderByDescending(item => item.Date, StringComparer.Ordinal)
                .ThenBy(item => item.Title, StringComparer.OrdinalIgnoreCase)
                .ToArray();

    private IReadOnlyList<FeedEntry> FilteredFeedItems =>
        AllFeedItems
            .Where(item =>
                ActiveKind.Equals("all", StringComparison.OrdinalIgnoreCase)
                || item.Kind.Equals(ActiveKind, StringComparison.OrdinalIgnoreCase)
            )
            .Where(item =>
                string.IsNullOrWhiteSpace(ActiveTopic)
                || item.Topics.Any(topic =>
                    topic.Name.Equals(ActiveTopic, StringComparison.OrdinalIgnoreCase)
                )
            )
            .Where(MatchesSearch)
            .ToArray();

    private IReadOnlyList<FeedEntry> SortedFeedItems =>
        ActiveSort switch
        {
            "asc" => FilteredFeedItems
                .OrderBy(item => item.Date, StringComparer.Ordinal)
                .ThenBy(item => item.Title, StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            "alpha" => FilteredFeedItems
                .OrderBy(item => item.Title, StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            _ => FilteredFeedItems,
        };

    private IReadOnlyList<FeedEntry> PagedFeedItems =>
        ItemsForPage(SortedFeedItems, CurrentPage, PageSize);

    private IReadOnlyList<string> TopicOptions =>
        AllFeedItems
            .SelectMany(item => item.Topics)
            .Select(topic => topic.Name)
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(name => name, StringComparer.OrdinalIgnoreCase)
            .ToArray()
        ?? [];

    private int PageCount => PageCountFor(SortedFeedItems.Count, PageSize);
    private int CurrentPage => CurrentPageFor(QueryPage, PageCount);
    private string ResultsSummary => L["count_items", PagedFeedItems.Count];

    protected override void OnParametersSet()
    {
        KindValue = ActiveKind;
        TopicValue = ActiveTopic;
        SortValue = ActiveSort;
        PendingSearch = ActiveSearch;
    }

    private void HandleApply()
    {
        var query = new List<string>();
        if (FixedKind is null && !KindValue.Equals("all", StringComparison.OrdinalIgnoreCase))
            query.Add($"kind={Uri.EscapeDataString(KindValue)}");
        if (!string.IsNullOrWhiteSpace(TopicValue))
            query.Add($"topic={Uri.EscapeDataString(TopicValue)}");
        if (!string.IsNullOrWhiteSpace(PendingSearch))
            query.Add($"q={Uri.EscapeDataString(PendingSearch)}");
        if (!SortValue.Equals("desc", StringComparison.OrdinalIgnoreCase))
            query.Add($"sort={Uri.EscapeDataString(SortValue)}");
        if (ViewMode.Equals("dense", StringComparison.OrdinalIgnoreCase))
            query.Add("view=dense");
        var url = Action + (query.Count > 0 ? "?" + string.Join('&', query) : string.Empty);
        Navigation.NavigateTo(url);
    }

    private bool MatchesSearch(FeedEntry item)
    {
        if (string.IsNullOrWhiteSpace(ActiveSearch))
            return true;
        return item.Title.Contains(ActiveSearch, StringComparison.OrdinalIgnoreCase)
            || item.Preview.Text.Contains(ActiveSearch, StringComparison.OrdinalIgnoreCase);
    }

    private string KindLabel(string kind) =>
        kind switch
        {
            "post" => L["writing"],
            "achado" => L["finding"],
            "colecao" => L["collection"],
            _ => kind,
        };

    private static string KindIcon(string kind) =>
        kind switch
        {
            "post" => "pen-line",
            "achado" => "lightbulb",
            "colecao" => "archive",
            _ => "pen-line",
        };

    private string Text(string name, string fallback = "") => PageText("home", name, fallback);

    private string PageText(string slug, string name, string fallback)
    {
        if (
            Snapshot?.Pages.TryGetValue(slug, out var page) != true
            || page.ValueKind != System.Text.Json.JsonValueKind.Object
            || !page.TryGetProperty(name, out var value)
            || value.ValueKind != System.Text.Json.JsonValueKind.String
        )
        {
            return fallback;
        }

        return value.GetString() ?? fallback;
    }

    private string QueryUrl(string view, int page)
    {
        var query = new List<string>();
        if (FixedKind is null && !ActiveKind.Equals("all", StringComparison.OrdinalIgnoreCase))
            query.Add($"kind={Uri.EscapeDataString(ActiveKind)}");
        if (!string.IsNullOrWhiteSpace(ActiveTopic))
            query.Add($"topic={Uri.EscapeDataString(ActiveTopic)}");
        if (!string.IsNullOrWhiteSpace(ActiveSearch))
            query.Add($"q={Uri.EscapeDataString(ActiveSearch)}");
        if (!ActiveSort.Equals("desc", StringComparison.OrdinalIgnoreCase))
            query.Add($"sort={Uri.EscapeDataString(ActiveSort)}");
        if (view.Equals("dense", StringComparison.OrdinalIgnoreCase))
            query.Add("view=dense");
        if (page > 1)
            query.Add($"page={page}");
        return Action + (query.Count > 0 ? "?" + string.Join('&', query) : string.Empty);
    }

    private string LocalizedPath(string path) => L[""];

    private static string LocalizedUrl(string url)
    {
        var path = new Uri(url).AbsolutePath;
        return LocalizedUrls.Current(path);
    }

    private sealed record FeedEntry(
        string Kind,
        string Url,
        string Title,
        (string Text, bool Truncated) Preview,
        string Date,
        string? ReadingTime,
        string? ExternalUrl,
        string? ExternalLabel,
        IReadOnlyList<TopicLink> Topics
    );

    private sealed record TopicLink(string Name, string? Url);
}
