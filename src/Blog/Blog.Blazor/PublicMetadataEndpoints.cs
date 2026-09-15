using System.Text.Json;
using System.Xml.Linq;
using Blog.Blazor.Core;
using Blog.Blazor.Core.Localization;

namespace Blog.Blazor;

public static class PublicMetadataEndpoints
{
    private static readonly string[] StaticPaths =
    [
        "/",
        "/about",
        "/portfolio",
        "/projects",
        "/cases",
        "/topics",
        "/technologies",
        "/knowledge-map",
        "/resume",
        "/contact",
        "/credits",
        "/license",
        "/follow",
    ];

    public static void Map(WebApplication app)
    {
        app.MapGet(
            "/robots.txt",
            async (IPublicSiteContentProvider provider, CancellationToken cancellationToken) =>
            {
                var snapshot = await provider.GetAsync("en", cancellationToken);
                if (snapshot?.Chrome.Site.MaintenanceEnabled == true)
                    return Results.Text("User-agent: *\nDisallow: /\n", "text/plain");

                return Results.Text(
                    "User-agent: *\nAllow: /\n\n"
                        + string.Join(
                            "\n",
                            new[]
                            {
                                "GPTBot",
                                "ChatGPT-User",
                                "CCBot",
                                "Google-Extended",
                                "ClaudeBot",
                                "anthropic-ai",
                                "Claude-Web",
                                "Bytespider",
                                "Applebot-Extended",
                                "Amazonbot",
                                "Meta-ExternalAgent",
                                "Diffbot",
                                "PerplexityBot",
                            }.Select(bot => $"User-agent: {bot}\nDisallow: /\n")
                        )
                        + $"\nSitemap: {AbsoluteUrl("/sitemap.xml")}\n",
                    "text/plain"
                );
            }
        );

        app.MapGet(
            "/sitemap.xml",
            async (IPublicSiteContentProvider provider, CancellationToken cancellationToken) =>
            {
                var documents = new List<XElement>();
                foreach (var locale in new[] { "en", "pt-BR" })
                {
                    var snapshot = await provider.GetAsync(locale, cancellationToken);
                    if (snapshot is null)
                        continue;
                    if (snapshot.Chrome.Site.MaintenanceEnabled)
                        return Results.Text(string.Empty, "text/xml; charset=UTF-8");

                    foreach (var path in StaticPaths)
                        AddUrl(documents, LocalizedUrl(path, locale));
                    foreach (var item in snapshot.Projects)
                        AddUrl(documents, AbsoluteUrl(Localize(item.Url, locale)));
                    foreach (var item in snapshot.Cases)
                        AddUrl(documents, AbsoluteUrl(Localize(item.Url, locale)));
                    foreach (var item in snapshot.Writings)
                        AddUrl(documents, AbsoluteUrl(Localize(item.Url, locale)));
                    foreach (var item in snapshot.Findings)
                        AddUrl(documents, AbsoluteUrl(Localize(item.Url, locale)));
                    foreach (var item in snapshot.Collections)
                        AddUrl(documents, AbsoluteUrl(Localize(item.Url, locale)));
                    foreach (var item in snapshot.Topics)
                        AddUrl(
                            documents,
                            AbsoluteUrl(Localize(item.Url ?? $"/topics/{item.Slug}", locale))
                        );
                    foreach (var item in snapshot.Technologies)
                        AddUrl(
                            documents,
                            AbsoluteUrl(Localize(item.Url ?? $"/technologies/{item.Slug}", locale))
                        );
                    foreach (var item in snapshot.Experiments)
                        AddUrl(documents, AbsoluteUrl(Localize(item.Url, locale)));
                }

                var xml = new XDocument(
                    new XDeclaration("1.0", "UTF-8", null),
                    new XElement(
                        XName.Get("urlset", "http://www.sitemaps.org/schemas/sitemap/0.9"),
                        documents
                    )
                );
                return Results.Text(
                    xml.ToString(SaveOptions.DisableFormatting),
                    "application/xml; charset=UTF-8"
                );
            }
        );

        app.MapGet(
            "/.well-known/webfinger",
            async (
                HttpRequest request,
                IPublicSiteContentProvider provider,
                CancellationToken cancellationToken
            ) =>
            {
                var account = Environment.GetEnvironmentVariable("WEBFINGER_ACCT");
                var resource = request.Query["resource"].ToString();
                if (string.IsNullOrWhiteSpace(account))
                    return Results.NotFound(new { error = "not_found" });
                if (string.IsNullOrWhiteSpace(resource))
                    return Results.BadRequest(new { error = "resource_required" });
                var home = AbsoluteUrl("/");
                if (
                    !resource.Equals($"acct:{account}", StringComparison.OrdinalIgnoreCase)
                    && !resource.Equals(home, StringComparison.OrdinalIgnoreCase)
                )
                    return Results.NotFound(new { error = "not_found" });

                var snapshot = await provider.GetAsync("en", cancellationToken);
                var about = AbsoluteUrl("/about");
                var links = new List<object>
                {
                    new
                    {
                        rel = "http://webfinger.net/rel/profile-page",
                        type = "text/html",
                        href = about,
                    },
                };
                links.AddRange(
                    snapshot
                        ?.Chrome.Site.ContactProfiles?.Where(profile =>
                            !string.IsNullOrWhiteSpace(profile.Url)
                        )
                        .Select(profile => (object)new { rel = "me", href = profile.Url! })
                        ?? []
                );
                return Results.Json(
                    new
                    {
                        subject = $"acct:{account}",
                        aliases = new[] { about },
                        links,
                    },
                    new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase },
                    "application/jrd+json; charset=UTF-8"
                );
            }
        );

        MapFeed(app, "/feed.xml", "en", "application/rss+xml; charset=UTF-8", BuildRss);
        MapFeed(app, "/pt-BR/feed.xml", "pt-BR", "application/rss+xml; charset=UTF-8", BuildRss);
        MapFeed(app, "/atom.xml", "en", "application/atom+xml; charset=UTF-8", BuildAtom);
        MapFeed(app, "/pt-BR/atom.xml", "pt-BR", "application/atom+xml; charset=UTF-8", BuildAtom);
        app.MapGet(
            "/feed.json",
            (IPublicSiteContentProvider provider, CancellationToken cancellationToken) =>
                BuildJsonFeedAsync("en", provider, cancellationToken)
        );
        app.MapGet(
            "/pt-BR/feed.json",
            (IPublicSiteContentProvider provider, CancellationToken cancellationToken) =>
                BuildJsonFeedAsync("pt-BR", provider, cancellationToken)
        );
    }

    private static void MapFeed(
        WebApplication app,
        string path,
        string locale,
        string contentType,
        Func<string, IReadOnlyList<FeedItem>, string> renderer
    )
    {
        app.MapGet(
            path,
            async (IPublicSiteContentProvider provider, CancellationToken cancellationToken) =>
            {
                var snapshot = await provider.GetAsync(locale, cancellationToken);
                var items = FeedItems(snapshot, locale);
                return Results.Text(renderer(locale, items), contentType);
            }
        );
    }

    private static async Task<IResult> BuildJsonFeedAsync(
        string locale,
        IPublicSiteContentProvider provider,
        CancellationToken cancellationToken
    )
    {
        var snapshot = await provider.GetAsync(locale, cancellationToken);
        var items = FeedItems(snapshot, locale);
        var siteTitle = snapshot?.Chrome.Profile?.Name ?? "Portfolio";
        var home = AbsoluteUrl(LocalizedPath("/", locale));
        return Results.Json(
            new
            {
                version = "https://jsonfeed.org/version/1.1",
                title = siteTitle,
                home_page_url = home,
                feed_url = AbsoluteUrl(LocalizedPath("/feed.json", locale)),
                language = locale,
                items = items.Select(item => new
                {
                    id = item.Url,
                    url = item.Url,
                    title = item.Title,
                    summary = item.Excerpt,
                    date_published = item.Date?.ToUniversalTime().ToString("O"),
                }),
            },
            new JsonSerializerOptions
            {
                DefaultIgnoreCondition = System
                    .Text
                    .Json
                    .Serialization
                    .JsonIgnoreCondition
                    .WhenWritingNull,
            },
            "application/feed+json; charset=UTF-8"
        );
    }

    private static IReadOnlyList<FeedItem> FeedItems(PublicSiteSnapshot? snapshot, string locale)
    {
        if (snapshot is null)
            return [];
        var items = PublicFeedContent
            .Entries(snapshot)
            .Select(entry => new FeedItem(
                entry.Title,
                entry.Excerpt,
                entry.RawDate,
                AbsoluteUrl(Localize(entry.RelativeUrl, locale))
            ))
            .Select(item => item with { Date = ParseDate(item.RawDate) })
            .OrderByDescending(item => item.Date ?? DateTimeOffset.MinValue)
            .Take(30)
            .ToArray();
        return items;
    }

    private static string BuildRss(string locale, IReadOnlyList<FeedItem> items)
    {
        var home = AbsoluteUrl(LocalizedPath("/", locale));
        var feed = AbsoluteUrl(LocalizedPath("/feed.xml", locale));
        var channel = new XElement(
            "channel",
            new XElement("title", "Portfolio"),
            new XElement("link", home),
            new XElement("description", "Portfolio"),
            new XElement("language", locale),
            new XElement(
                XName.Get("link", "http://www.w3.org/2005/Atom"),
                new XAttribute("href", feed),
                new XAttribute("rel", "self"),
                new XAttribute("type", "application/rss+xml")
            ),
            items.Select(item => new XElement(
                "item",
                new XElement("title", item.Title),
                new XElement("link", item.Url),
                new XElement("guid", new XAttribute("isPermaLink", "true"), item.Url),
                item.Date is null
                    ? null
                    : new XElement("pubDate", item.Date.Value.ToUniversalTime().ToString("R")),
                string.IsNullOrWhiteSpace(item.Excerpt)
                    ? null
                    : new XElement("description", item.Excerpt)
            ))
        );
        return new XDocument(
            new XDeclaration("1.0", "UTF-8", null),
            new XElement("rss", new XAttribute("version", "2.0"), channel)
        ).ToString(SaveOptions.DisableFormatting);
    }

    private static string BuildAtom(string locale, IReadOnlyList<FeedItem> items)
    {
        var feed = AbsoluteUrl(LocalizedPath("/atom.xml", locale));
        var root = XName.Get("feed", "http://www.w3.org/2005/Atom");
        var rootElement = new XElement(
            root,
            new XElement(root.Namespace + "id", feed),
            new XElement(root.Namespace + "title", "Portfolio"),
            new XElement(
                root.Namespace + "updated",
                (items.FirstOrDefault()?.Date ?? DateTimeOffset.UtcNow)
                    .ToUniversalTime()
                    .ToString("O")
            ),
            new XElement(
                root.Namespace + "link",
                new XAttribute("rel", "self"),
                new XAttribute("href", feed)
            ),
            items.Select(item => new XElement(
                root.Namespace + "entry",
                new XElement(root.Namespace + "id", item.Url),
                new XElement(root.Namespace + "title", item.Title),
                new XElement(root.Namespace + "link", new XAttribute("href", item.Url)),
                new XElement(
                    root.Namespace + "updated",
                    (item.Date ?? DateTimeOffset.UtcNow).ToUniversalTime().ToString("O")
                ),
                string.IsNullOrWhiteSpace(item.Excerpt)
                    ? null
                    : new XElement(root.Namespace + "summary", item.Excerpt)
            ))
        );
        return new XDocument(new XDeclaration("1.0", "UTF-8", null), rootElement).ToString(
            SaveOptions.DisableFormatting
        );
    }

    private static void AddUrl(List<XElement> documents, string url) =>
        documents.Add(
            new XElement(
                XName.Get("url", "http://www.sitemaps.org/schemas/sitemap/0.9"),
                new XElement(XName.Get("loc", "http://www.sitemaps.org/schemas/sitemap/0.9"), url)
            )
        );

    private static string AbsoluteUrl(string path) =>
        $"{(Environment.GetEnvironmentVariable("PUBLIC_SITE_BASE_URL") ?? "http://localhost:8080").TrimEnd('/')}/{path.TrimStart('/')}";

    private static string LocalizedUrl(string path, string locale) =>
        AbsoluteUrl(LocalizedPath(path, locale));

    private static string Localize(string path, string locale) => LocalizedPath(path, locale);

    private static string LocalizedPath(string path, string locale)
    {
        var normalized = CultureCatalog.NormalizeName(locale);
        var unlocalized = path.StartsWith("/pt-BR", StringComparison.OrdinalIgnoreCase)
            ? path[6..]
            : path;
        if (unlocalized.Length == 0)
            unlocalized = "/";
        return normalized.Equals("pt-BR", StringComparison.OrdinalIgnoreCase)
            ? $"/pt-BR{(unlocalized == "/" ? string.Empty : unlocalized)}"
            : unlocalized;
    }

    private static DateTimeOffset? ParseDate(string? value) =>
        DateTimeOffset.TryParse(value, out var date) ? date : null;

    private sealed record FeedItem(string Title, string? Excerpt, string? RawDate, string Url)
    {
        public DateTimeOffset? Date { get; init; }
    }
}
