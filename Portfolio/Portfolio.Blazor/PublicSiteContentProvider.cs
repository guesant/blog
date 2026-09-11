using System.Collections.Concurrent;
using System.Globalization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Portfolio.Blazor.Core;
using Portfolio.Blazor.Core.Localization;
using Portfolio.Blazor.Data;
using Portfolio.Blazor.Data.Providers;
using Portfolio.Blazor.PublicQueries;

namespace Portfolio.Blazor;

public sealed partial class PublicSiteContentProvider(
    IDatabaseProvider database,
    IDbContextFactory<PortfolioPublicDbContext> contexts,
    IConfiguration configuration,
    ILogger<PublicSiteContentProvider> logger,
    ProtectedEmailChallengeService challengeService,
    IStringLocalizer<SharedResource> localizer
) : IPublicSiteContentProvider
{
    private readonly string _publicAssetRoot =
        configuration["PORTFOLIO_PUBLIC_ASSET_ROOT"] ?? "/data/public";
    private readonly string _resumePdfRoot =
        configuration["PORTFOLIO_RESUME_PDF_ROOT"] ?? "/data/resume-cache";
    private readonly string? _commitSha = configuration["APP_COMMIT_SHA"];
    private readonly string? _buildTime = configuration["APP_BUILD_TIME"];
    private readonly SemaphoreSlim _snapshotGate = new(1, 1);
    private readonly ConcurrentDictionary<string, CachedSnapshot> _snapshots = new(
        StringComparer.OrdinalIgnoreCase
    );

    public async Task<PublicSiteSnapshot?> GetAsync(
        string locale,
        CancellationToken cancellationToken = default
    )
    {
        cancellationToken.ThrowIfCancellationRequested();
        locale = CultureCatalog.NormalizeName(locale);
        try
        {
            if (!database.IsContentAvailable())
            {
                LogDatabaseNotFound(logger);
                return null;
            }

            var fingerprint = await database.ReadFingerprintAsync(cancellationToken);
            if (_snapshots.TryGetValue(locale, out var cached) && cached.Fingerprint == fingerprint)
                return cached.Snapshot;

            await _snapshotGate.WaitAsync(cancellationToken);
            try
            {
                fingerprint = await database.ReadFingerprintAsync(cancellationToken);
                if (_snapshots.TryGetValue(locale, out cached) && cached.Fingerprint == fingerprint)
                    return cached.Snapshot;

                await using var context = await contexts.CreateDbContextAsync(cancellationToken);
                var snapshot = Build(context, locale);
                _snapshots[locale] = new CachedSnapshot(fingerprint, snapshot);
                return snapshot;
            }
            finally
            {
                _snapshotGate.Release();
            }
        }
        catch (Exception exception) when (database.IsReadFailure(exception))
        {
            LogDatabaseReadFailed(logger, exception);
            return null;
        }
    }

    private sealed record CachedSnapshot(
        ContentFingerprint Fingerprint,
        PublicSiteSnapshot Snapshot
    );

    private PublicSiteSnapshot Build(PortfolioPublicDbContext context, string locale)
    {
        var projects = Projects(context, locale);
        var cases = Cases(context, locale);
        var writings = Writings(context, locale);
        var site = ChromeQueries.Site(context);
        var siteId = site?.Id ?? 0;
        var profile = ChromeQueries.Profile(context, locale);
        var pages = ChromeQueries
            .Pages(context, locale)
            .ToDictionary(row => row.Slug, PageFields, StringComparer.OrdinalIgnoreCase);
        var siteTranslation = ChromeQueries.SiteTranslation(context, siteId, locale);

        var chrome = new PublicChrome(
            new PublicSite(
                Format.Text(site?.ShortName),
                Format.Text(site?.PortfolioUrl),
                Format.Text(site?.SourceRepositoryUrl),
                site?.ContactAvailable ?? false,
                ContactProfiles(context, siteId),
                null,
                site?.MaintenanceEnabled ?? false,
                MaintenanceField(siteTranslation?.MaintenanceEyebrow),
                MaintenanceField(siteTranslation?.MaintenanceTitle),
                MaintenanceField(siteTranslation?.MaintenanceDescription),
                JsonNullable(Format.Text(siteTranslation?.Seo))
            ),
            profile is null
                ? null
                : new PublicProfile(
                    Format.Text(profile.Name),
                    Format.Text(profile.Title),
                    Format.Text(profile.Location),
                    Format.Text(profile.Description),
                    JsonNullable(Format.Text(profile.Milestones)),
                    Format.Date(profile.BirthDate),
                    string.Empty,
                    string.Empty,
                    string.Empty,
                    null
                ),
            Copyright(context, siteId, profile?.Name ?? Format.Text(site?.ShortName), locale),
            Navigation(context, locale),
            new PublicBuild(_commitSha, _buildTime)
        );

        return new PublicSiteSnapshot(
            1,
            locale,
            DateTimeOffset.UtcNow.ToString("O"),
            chrome,
            pages,
            projects,
            cases,
            writings,
            Findings(context, locale),
            Collections(context, locale),
            Topics(context, locale),
            Technologies(context, locale),
            Experiments(context, locale),
            Snippets(context, locale),
            Credits(context, locale),
            Resume(context, cases, locale),
            Featured(FeaturedQueries.CaseSlugs(context), cases, item => item.Slug),
            Featured(FeaturedQueries.ProjectSlugs(context), projects, item => item.Slug),
            Featured(FeaturedQueries.WritingSlugs(context), writings, item => item.Slug),
            ResumePdfLocales()
        );
    }

    public async Task<PublicProtectedEmailChallenge?> CreateEmailChallengeAsync(
        CancellationToken cancellationToken = default
    )
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (!database.IsContentAvailable())
            return null;

        await using var context = await contexts.CreateDbContextAsync(cancellationToken);
        return await challengeService.CreateAsync(
            Format.Text(ChromeQueries.ContactEmail(context)),
            cancellationToken
        );
    }

    private List<string> ResumePdfLocales() =>
        new[] { "en", "pt-BR" }
            .Where(locale =>
                File.Exists(Path.Combine(_resumePdfRoot, $"resume-{locale}.pdf"))
                || File.Exists(Path.Combine(_publicAssetRoot, $"resume-{locale}.pdf"))
            )
            .ToList();

    private static List<PublicProject> Projects(PortfolioPublicDbContext context, string locale)
    {
        var technologies = ProjectQueries
            .Technologies(context, locale)
            .ToLookup(row => row.OwnerId);
        var history = HistoryQueries.ForProjects(context, locale).ToLookup(row => row.OwnerId);
        return ProjectQueries
            .Projects(context, locale)
            .Select(row => new PublicProject(
                row.Slug,
                Route("projects.show", PublicRouteKey.Compose(row.PublicId, row.Slug), locale),
                row.Name ?? row.Slug,
                Format.Text(row.Purpose),
                Format.Text(row.Status),
                Format.Timestamp(row.PublishedAt),
                row.External,
                Format.Text(row.Problem),
                Format.Text(row.CurrentFocus),
                JsonNullable(Format.Text(row.Metrics)),
                Format.Text(row.Body),
                Technologies(technologies[row.Id]),
                row.ShowHistory,
                History(history[row.Id]),
                Format.Text(row.Href),
                Related(
                    "projects.show",
                    ProjectQueries.RelatedBySharedTechnology(context, row.Id, locale),
                    () => ProjectQueries.RelatedRecent(context, row.Id, locale),
                    locale
                ),
                Format.Timestamp(row.UpdatedAt)
            ))
            .ToList();
    }

    private static List<PublicCaseStudy> Cases(PortfolioPublicDbContext context, string locale)
    {
        var technologies = CaseStudyQueries
            .Technologies(context, locale)
            .ToLookup(row => row.OwnerId);
        var history = HistoryQueries.ForCaseStudies(context, locale).ToLookup(row => row.OwnerId);
        return CaseStudyQueries
            .Cases(context, locale)
            .Select(row => new PublicCaseStudy(
                row.Slug,
                Route("cases.show", PublicRouteKey.Compose(row.PublicId, row.Slug), locale),
                row.Title ?? row.Slug,
                Format.Text(row.Status),
                Format.Text(row.Summary),
                Format.Timestamp(row.PublishedAt),
                row.External,
                Format.Text(row.Meta),
                Format.Text(row.Context),
                Format.Text(row.Role),
                Format.Text(row.Result),
                JsonNullable(Format.Text(row.Metrics)),
                Format.Text(row.Body),
                Technologies(technologies[row.Id]),
                row.ShowHistory,
                History(history[row.Id]),
                Format.Text(row.Href),
                Related(
                    "cases.show",
                    CaseStudyQueries.RelatedBySharedTechnology(context, row.Id, locale),
                    () => CaseStudyQueries.RelatedRecent(context, row.Id, locale),
                    locale
                ),
                Format.Timestamp(row.UpdatedAt)
            ))
            .ToList();
    }

    private static List<PublicWriting> Writings(PortfolioPublicDbContext context, string locale)
    {
        var topics = TopicQueries
            .TopicsFor(context, "writing", context.Writings.Select(w => w.Id), locale)
            .ToLookup(row => row.OwnerId);
        var history = HistoryQueries.ForWritings(context, locale).ToLookup(row => row.OwnerId);
        return WritingQueries
            .Writings(context, locale)
            .Select(row => new PublicWriting(
                row.Slug,
                Route("writing.show", PublicRouteKey.Compose(row.PublicId, row.Slug), locale),
                row.Title ?? row.Slug,
                Format.Text(row.Excerpt),
                Format.Text(row.ReadingTime),
                row.Type,
                Format.Date(row.DateIso),
                Format.Text(row.Body),
                topics[row.Id]
                    .Select(topic => new PublicTechnology(
                        topic.Slug,
                        topic.Name ?? topic.Slug,
                        Url: Route(
                            "topics.show",
                            PublicRouteKey.Compose(topic.PublicId, topic.Slug),
                            locale
                        )
                    ))
                    .ToList(),
                row.ShowHistory,
                History(history[row.Id]),
                WritingQueries
                    .Related(context, row.Id, locale)
                    .Select(related => new PublicRelatedContent(
                        related.Title ?? related.Slug,
                        Route(
                            "writing.show",
                            PublicRouteKey.Compose(related.PublicId, related.Slug),
                            locale
                        ),
                        Format.Date(related.Date)
                    ))
                    .ToList(),
                Format.Timestamp(row.UpdatedAt)
            ))
            .ToList();
    }

    private static List<PublicFinding> Findings(PortfolioPublicDbContext context, string locale)
    {
        var topics = TopicQueries
            .TopicsFor(context, "finding", context.Resources.Select(r => r.Id), locale)
            .ToLookup(row => row.OwnerId);
        var attribution = FindingQueries
            .AttributionTopics(context, locale)
            .ToLookup(row => row.ResourceId);
        var links = FindingQueries.Links(context).ToLookup(row => row.ResourceId);
        var identifiers = FindingQueries.Identifiers(context).ToLookup(row => row.ResourceId);
        return FindingQueries
            .Findings(context, locale)
            .Select(row => new PublicFinding(
                row.Slug,
                Route("findings.show", PublicRouteKey.Compose(row.PublicId, row.Slug), locale),
                row.Type,
                Format.Text(row.Authors),
                Format.Text(row.Organizations),
                Format.Date(row.PublishedDateIso),
                Format.Date(row.FoundDateIso),
                Format.Text(row.Rating),
                Format.Text(row.ConsumptionState),
                JsonNullable(Format.Text(row.TypeDetails)),
                Format.Text(row.Title),
                Format.Text(row.AlternativeTitle),
                Format.Text(row.Description),
                Format.Text(row.PersonalNote),
                Format.Text(row.ReasonFound),
                Format.Date(row.UpdatedAt),
                Topics(topics[row.Id], locale),
                attribution[row.Id]
                    .Distinct()
                    .Select(topic => Topic(topic.Slug, topic.PublicId, topic.Name, locale))
                    .ToList(),
                links[row.Id]
                    .Select(link => new PublicFindingLink(
                        link.Url,
                        Format.Text(link.Label),
                        Format.Text(link.Platform),
                        Format.Text(link.Purpose),
                        link.IsFree,
                        link.IsPrimary
                    ))
                    .ToList(),
                identifiers[row.Id]
                    .Select(identifier => new PublicIdentifier(identifier.Kind, identifier.Value))
                    .ToList(),
                RelatedFindings(context, row.Id, row.Type, locale)
            ))
            .ToList();
    }

    private static List<PublicRelatedContent> RelatedFindings(
        PortfolioPublicDbContext context,
        int id,
        string type,
        string locale
    )
    {
        var rows = FindingQueries.RelatedByTopic(context, id, locale);
        if (rows.Count == 0)
            rows = FindingQueries.RelatedByType(context, id, type, locale);
        return rows.Select(row => new PublicRelatedContent(
                row.Title ?? row.Slug,
                Route("findings.show", PublicRouteKey.Compose(row.PublicId, row.Slug), locale),
                Format.Date(row.Date)
            ))
            .ToList();
    }

    private static List<PublicTopic> Topics(IEnumerable<OwnerTopicRow> rows, string locale) =>
        rows.Select(row => Topic(row.Slug, row.PublicId, row.Name, locale)).ToList();

    private static PublicTopic Topic(string slug, string publicId, string? name, string locale) =>
        new(
            slug,
            name ?? slug,
            Route("topics.show", PublicRouteKey.Compose(publicId, slug), locale)
        );

    private static List<PublicCollection> Collections(
        PortfolioPublicDbContext context,
        string locale
    )
    {
        var items = CollectionQueries.Items(context, locale).ToLookup(row => row.CollectionId);
        var topics = TopicQueries
            .TopicsFor(context, "finding", context.Resources.Select(r => r.Id), locale)
            .ToLookup(row => row.OwnerId);
        return CollectionQueries
            .Collections(context, locale)
            .Select(row => new PublicCollection(
                row.Slug,
                Route("collections.show", PublicRouteKey.Compose(row.PublicId, row.Slug), locale),
                row.Title ?? row.Slug,
                Format.Text(row.Description),
                Format.Text(row.Intro),
                Format.Timestamp(row.PublishedAt),
                items[row.Id]
                    .Select(item => new PublicCollectionItem(
                        item.Slug,
                        Route(
                            "findings.show",
                            PublicRouteKey.Compose(item.PublicId, item.Slug),
                            locale
                        ),
                        item.Title ?? item.Slug,
                        Format.Text(item.Description),
                        item.Type,
                        Format.Text(item.Rating),
                        Format.Text(item.Note),
                        Topics(topics[item.ResourceId], locale)
                    ))
                    .ToList(),
                Related(
                    "collections.show",
                    CollectionQueries.RelatedRecent(context, row.Id, locale),
                    () => [],
                    locale
                ),
                Format.Timestamp(row.UpdatedAt),
                Format.Timestamp(row.CreatedAt)
            ))
            .ToList();
    }

    private static List<PublicTopic> Topics(PortfolioPublicDbContext context, string locale) =>
        TopicQueries
            .Topics(context, locale)
            .Select(row => Topic(row.Slug, row.PublicId, row.Name, locale))
            .ToList();

    private static List<PublicTechnology> Technologies(
        PortfolioPublicDbContext context,
        string locale
    )
    {
        var skills = TopicQueries
            .ResumeSkillTopics(context, locale)
            .ToLookup(row => row.TechnologyId);
        return TopicQueries
            .Technologies(context, locale)
            .Select(row => new PublicTechnology(
                row.Slug,
                row.Name ?? row.Slug,
                Format.Text(row.Code),
                Route("technologies.show", PublicRouteKey.Compose(row.PublicId, row.Slug), locale),
                skills[row.Id]
                    .Select(skill => Format.Text(skill.Name))
                    .Where(value => value.Length > 0)
                    .ToList(),
                skills[row.Id]
                    .Select(skill => Topic(skill.Slug, skill.PublicId, skill.Name, locale))
                    .GroupBy(topic => topic.Slug, StringComparer.OrdinalIgnoreCase)
                    .Select(group => group.First())
                    .ToList()
            ))
            .ToList();
    }

    private static List<PublicExperiment> Experiments(
        PortfolioPublicDbContext context,
        string locale
    )
    {
        var technologies = ExperimentQueries
            .Technologies(context, locale)
            .ToLookup(row => row.OwnerId);
        var history = HistoryQueries.ForExperiments(context, locale).ToLookup(row => row.OwnerId);
        return ExperimentQueries
            .Experiments(context, locale)
            .Select(row => new PublicExperiment(
                row.Slug,
                Route(
                    "projects.experiments.show",
                    PublicRouteKey.Compose(row.PublicId, row.Slug),
                    locale
                ),
                row.Name ?? row.Slug,
                Format.Text(row.Purpose),
                Format.Text(row.Body),
                Format.Timestamp(row.PublishedAt),
                row.External,
                Technologies(technologies[row.Id]),
                Format.Text(row.Href),
                Format.Timestamp(row.UpdatedAt),
                row.ShowHistory,
                History(history[row.Id]),
                Related(
                    "projects.experiments.show",
                    ExperimentQueries.RelatedBySharedTechnology(context, row.Id, locale),
                    () => ExperimentQueries.RelatedRecent(context, row.Id, locale),
                    locale
                )
            ))
            .ToList();
    }

    private static List<PublicTechnology> Technologies(IEnumerable<OwnerTechnologyRow> rows) =>
        rows.Select(row => new PublicTechnology(row.Slug, row.Name ?? row.Slug)).ToList();

    private static List<PublicHistoryEntry> History(IEnumerable<HistoryRow> rows) =>
        rows.Select(row => new PublicHistoryEntry(
                Format.Id(row.Id),
                Format.Timestamp(row.CreatedAt) is { Length: > 0 } createdAt
                    ? createdAt
                    : Format.Id(row.Id),
                Values(Format.Text(row.OldValues)),
                Values(Format.Text(row.NewValues))
            ))
            .ToList();

    private static List<PublicRelatedContent> Related(
        string route,
        List<RelatedRow> shared,
        Func<List<RelatedRow>> recent,
        string locale
    ) =>
        (shared.Count == 0 ? recent() : shared)
            .Select(row => new PublicRelatedContent(
                row.Title ?? row.Slug,
                Route(route, PublicRouteKey.Compose(row.PublicId, row.Slug), locale),
                Format.Timestamp(row.Date)
            ))
            .ToList();

    private static List<PublicSnippet> Snippets(PortfolioPublicDbContext context, string locale)
    {
        var files = SnippetQueries.Files(context).ToLookup(row => row.SnippetId);
        var fileHistory = HistoryQueries.ForSnippetFiles(context).ToLookup(row => row.OwnerId);
        var history = HistoryQueries.ForSnippets(context, locale).ToLookup(row => row.OwnerId);
        return SnippetQueries
            .Snippets(context, locale)
            .Select(row => new PublicSnippet(
                row.Slug,
                Route("snippets.show", PublicRouteKey.Compose(row.PublicId, row.Slug), locale),
                row.Title ?? row.Slug,
                Format.Text(row.Description),
                Format.Timestamp(row.PublishedAt),
                files[row.Id]
                    .Select(file => new PublicSnippetFile(
                        file.Path,
                        Format.Text(file.Language),
                        file.Content,
                        Format.Id(file.Id),
                        History(fileHistory[file.Id])
                    ))
                    .ToList(),
                row.ShowHistory,
                History(history[row.Id]),
                Related(
                    "snippets.show",
                    SnippetQueries.RelatedRecent(context, row.Id, locale),
                    () => [],
                    locale
                ),
                Format.Timestamp(row.UpdatedAt)
            ))
            .ToList();
    }

    private static List<PublicCredit> Credits(PortfolioPublicDbContext context, string locale) =>
        CreditQueries
            .Credits(context, locale)
            .Select(row => new PublicCredit(
                row.Category,
                row.Name ?? row.Category,
                Format.Text(row.Description),
                Format.Text(row.Url),
                Format.Timestamp(row.CreatedAt)
            ))
            .ToList();

    private static List<T> Featured<T>(IEnumerable<string> slugs, List<T> all, Func<T, string> slug)
    {
        var index = all.ToDictionary(slug, StringComparer.OrdinalIgnoreCase);
        return slugs
            .Select(value => index.GetValueOrDefault(value))
            .Where(item => item is not null)
            .Cast<T>()
            .ToList();
    }

    private static JsonElement Resume(
        PortfolioPublicDbContext context,
        List<PublicCaseStudy> cases,
        string locale
    )
    {
        var row = ResumeQueries.Resume(context, locale);
        if (row is null)
            return JsonDocument.Parse("{}").RootElement.Clone();

        var fields = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase)
        {
            ["summary"] = row.Summary,
            ["leadership"] = JsonArray(row.Leadership),
            ["education"] = JsonArray(row.Education),
            ["certificates"] = JsonArray(row.Certificates),
            ["certifications"] = JsonArray(row.Certifications),
            ["publications"] = JsonArray(row.Publications),
            ["recommendations"] = JsonArray(row.Recommendations),
            ["technical_productions"] = JsonArray(row.TechnicalProductions),
            ["events"] = JsonArray(row.Events),
            ["awards"] = JsonArray(row.Awards),
        };

        var trajectory = ChromeQueries.Trajectory(context, locale);
        if (!string.IsNullOrWhiteSpace(trajectory))
            fields["experience"] = JsonArray(trajectory);

        if (row.ResumeId > 0)
        {
            var selectedCases = ResumeQueries
                .SelectedCaseSlugs(context, row.ResumeId)
                .Select(slug => cases.FirstOrDefault(value => value.Slug == slug))
                .Where(value => value is not null)
                .ToArray();
            fields["selected_cases"] = System.Text.Json.JsonSerializer.SerializeToElement(
                selectedCases
            );

            var technologies = ResumeQueries
                .SkillTechnologies(context, row.ResumeId, locale)
                .ToLookup(item => item.OwnerId);
            var skills = ResumeQueries
                .Skills(context, row.ResumeId, locale)
                .Select(item => new
                {
                    name = item.Name ?? item.Slug,
                    technologies = Technologies(technologies[item.Id]),
                })
                .ToArray();
            fields["skills"] = System.Text.Json.JsonSerializer.SerializeToElement(skills);

            var languages = ResumeQueries
                .Languages(context, row.ResumeId, locale)
                .Select(item => new
                {
                    name = item.Name ?? item.Slug,
                    proficiency = Format.Text(item.Proficiency),
                })
                .ToArray();
            fields["languages"] = System.Text.Json.JsonSerializer.SerializeToElement(languages);
        }

        return JsonDocument
            .Parse(System.Text.Json.JsonSerializer.Serialize(fields))
            .RootElement.Clone();
    }

    private static object? JsonArray(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return json;
        try
        {
            return JsonDocument.Parse(json).RootElement.Clone();
        }
        catch (JsonException)
        {
            return Array.Empty<object>();
        }
    }

    private static JsonElement Json(string value) =>
        string.IsNullOrWhiteSpace(value)
            ? JsonDocument.Parse("{}").RootElement.Clone()
            : JsonDocument.Parse(value).RootElement.Clone();

    private static JsonElement PageFields(PageRow row)
    {
        var fields = Json(Format.Text(row.Fields));
        var updatedAt = Format.Timestamp(row.UpdatedAt);
        if (fields.ValueKind != JsonValueKind.Object || updatedAt.Length == 0)
            return fields;
        var values = fields
            .EnumerateObject()
            .ToDictionary(
                item => item.Name,
                item => item.Value.Clone(),
                StringComparer.OrdinalIgnoreCase
            );
        values["updated_at"] = JsonSerializer.SerializeToElement(updatedAt);
        return JsonDocument.Parse(JsonSerializer.Serialize(values)).RootElement.Clone();
    }

    private static List<PublicContactProfile> ContactProfiles(
        PortfolioPublicDbContext context,
        int siteId
    ) =>
        ChromeQueries
            .ContactProfiles(context, siteId)
            .Select(row => new PublicContactProfile(
                row.Platform,
                row.Label ?? row.Platform,
                row.Url
            ))
            .ToList();

    private static string? MaintenanceField(string? value) =>
        string.IsNullOrEmpty(value) ? null : value;

    private string Copyright(
        PortfolioPublicDbContext context,
        int siteId,
        string name,
        string locale
    )
    {
        var template =
            ChromeQueries.CopyrightTemplate(context, siteId, locale)
            ?? localizer["some_rights_reserved"].Value;
        template = template.Replace(
            "Some rights reserved",
            "some rights reserved",
            StringComparison.OrdinalIgnoreCase
        );
        template = template.Replace(
            "Alguns direitos reservados",
            "alguns direitos reservados",
            StringComparison.OrdinalIgnoreCase
        );
        return template.Replace("{year}", DateTime.UtcNow.Year.ToString()).Replace("{name}", name);
    }

    private static List<PublicNavigationItem> NavigationRoots(
        List<NavRow> rows,
        string locale,
        Func<NavRow, bool> predicate
    ) =>
        rows.Where(row => row.ParentId == null && predicate(row))
            .Select(row => new PublicNavigationItem(
                Route(row.RouteName, "", locale),
                Format.Text(row.Label),
                rows.Where(child => child.ParentId == row.Id)
                    .Select(child => new PublicNavigationItem(
                        Route(child.RouteName, "", locale),
                        Format.Text(child.Label)
                    ))
                    .GroupBy(child => child.Route, StringComparer.OrdinalIgnoreCase)
                    .Select(group => group.First())
                    .ToList()
            ))
            .GroupBy(item => item.Route, StringComparer.OrdinalIgnoreCase)
            .Select(group => group.First())
            .ToList();

    private static PublicNavigation Navigation(PortfolioPublicDbContext context, string locale)
    {
        var rows = ChromeQueries.NavItems(context, locale);
        var sidebarRoots = rows.Where(row =>
                row.ParentId == null && Format.Text(row.Placement) == "sidebar"
            )
            .ToList();
        var sidebarItems = NavigationRoots(
            rows,
            locale,
            row => Format.Text(row.Placement) == "sidebar"
        );
        var groups = sidebarRoots
            .Where(row => row.SidebarGroup != null)
            .GroupBy(row => row.SidebarGroup!.Value.ToString(CultureInfo.InvariantCulture))
            .OrderBy(group => group.Key)
            .Select(group =>
                sidebarItems
                    .Where(item => group.Any(row => Route(row.RouteName, "", locale) == item.Route))
                    .ToList()
            )
            .Where(group => group.Count > 0)
            .ToList();
        var footerLinks = NavigationRoots(
            rows,
            locale,
            row => Format.Text(row.Placement) == "footer_links"
        );
        var sitemap = NavigationRoots(rows, locale, _ => true);
        return new PublicNavigation(groups, footerLinks, sitemap);
    }

    private static Dictionary<string, string?> Values(string json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return new(StringComparer.OrdinalIgnoreCase);
        try
        {
            using var document = JsonDocument.Parse(json);
            return document.RootElement.ValueKind == JsonValueKind.Object
                ? document
                    .RootElement.EnumerateObject()
                    .ToDictionary(
                        item => item.Name,
                        item =>
                            item.Value.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined
                                ? null
                                : item.Value.ToString(),
                        StringComparer.OrdinalIgnoreCase
                    )
                : new(StringComparer.OrdinalIgnoreCase);
        }
        catch (JsonException)
        {
            return new(StringComparer.OrdinalIgnoreCase);
        }
    }

    private static JsonElement? JsonNullable(string value) =>
        string.IsNullOrWhiteSpace(value) ? null : JsonDocument.Parse(value).RootElement.Clone();

    [LoggerMessage(
        EventId = 1003,
        Level = LogLevel.Error,
        Message = "Public content database is not available."
    )]
    private static partial void LogDatabaseNotFound(ILogger logger);

    [LoggerMessage(
        EventId = 1004,
        Level = LogLevel.Error,
        Message = "Could not read the portfolio SQLite database in read-only mode."
    )]
    private static partial void LogDatabaseReadFailed(ILogger logger, Exception exception);

    private static string Route(string route, string slug, string locale)
    {
        var prefix = CultureCatalog.UrlPrefix(locale);
        return route switch
        {
            "home" => string.IsNullOrEmpty(prefix) ? "/" : prefix,
            "projects.show" => $"{prefix}/projects/{slug}",
            "cases.show" => $"{prefix}/cases/{slug}",
            "writing.show" => $"{prefix}/writing/{slug}",
            "findings.show" => $"{prefix}/findings/{slug}",
            "collections.show" => $"{prefix}/collections/{slug}",
            "topics.show" => $"{prefix}/topics/{slug}",
            "technologies.show" => $"{prefix}/technologies/{slug}",
            "snippets.show" => $"{prefix}/snippets/{slug}",
            "projects.experiments.show" => $"{prefix}/projects/experiments/{slug}",
            "about" => $"{prefix}/about",
            "portfolio" => $"{prefix}/portfolio",
            "resume" => $"{prefix}/resume",
            "contact" => $"{prefix}/contact",
            _ => $"{prefix}/{route.Replace('.', '/')}",
        };
    }
}
