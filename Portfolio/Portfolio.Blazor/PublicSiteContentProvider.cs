using System.Collections.Concurrent;
using System.Data.Common;
using System.Globalization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Portfolio.Blazor.Core;
using Portfolio.Blazor.Core.Localization;
using Portfolio.Blazor.Data;
using Portfolio.Blazor.Data.Providers;
using Portfolio.Blazor.PublicQueries;
using static Portfolio.Blazor.SqlReadHelpers;

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

                using var connection = await database.OpenReadOnlyConnectionAsync(
                    cancellationToken
                );
                await using var context = await contexts.CreateDbContextAsync(cancellationToken);
                var snapshot = Build(connection, context, locale);
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

    private PublicSiteSnapshot Build(
        DbConnection db,
        PortfolioPublicDbContext context,
        string locale
    )
    {
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
            Projects(context, locale),
            Cases(context, locale),
            Writings(context, locale),
            Findings(db, locale),
            Collections(db, locale),
            Topics(context, locale),
            Technologies(context, locale),
            Experiments(context, locale),
            Snippets(context, locale),
            Credits(context, locale),
            Resume(db, context, locale),
            FeaturedCases(db, context, locale),
            FeaturedProjects(db, context, locale),
            FeaturedWritings(db, context, locale),
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

    private static List<PublicFinding> Findings(DbConnection db, string locale) =>
        Rows(
                db,
                "select r.*, coalesce(t.title, en.title) as title, coalesce(t.alternative_title, en.alternative_title) as alternative_title, coalesce(t.description, en.description) as description, coalesce(t.personal_note, en.personal_note) as personal_note, coalesce(t.reason_found, en.reason_found) as reason_found from resources r left join resource_translations t on t.resource_id=r.id and t.locale=@locale left join resource_translations en on en.resource_id=r.id and en.locale='en' where r.hidden=false and r.visibility='public' order by r.\"order\" nulls first",
                ("@locale", locale)
            )
            .Select(row => new PublicFinding(
                Text(row, "slug"),
                Route("findings.show", Key(row), locale),
                Text(row, "type"),
                Text(row, "authors"),
                Text(row, "organizations"),
                Date(row, "published_date_iso"),
                Date(row, "found_date_iso"),
                Text(row, "rating"),
                Text(row, "consumption_state"),
                JsonNullable(Text(row, "type_details")),
                Text(row, "title"),
                Text(row, "alternative_title"),
                Text(row, "description"),
                Text(row, "personal_note"),
                Text(row, "reason_found"),
                Date(row, "updated_at"),
                TopicsFor(db, "resource", Id(row, "id"), locale),
                AttributionTopicsFor(db, Id(row, "id"), locale),
                LinksFor(db, Id(row, "id")),
                IdentifiersFor(db, Id(row, "id")),
                RelatedFindings(db, Id(row, "id"), Text(row, "type"), locale)
            ))
            .ToList();

    private static List<PublicCollection> Collections(DbConnection db, string locale) =>
        Rows(
                db,
                "select c.*, coalesce(t.title, en.title) as title, coalesce(t.description, en.description) as description, coalesce(t.intro, en.intro) as intro from reference_collections c left join reference_collection_translations t on t.reference_collection_id=c.id and t.locale=@locale left join reference_collection_translations en on en.reference_collection_id=c.id and en.locale='en' where c.hidden=false order by c.\"order\" nulls first",
                ("@locale", locale)
            )
            .Select(row => new PublicCollection(
                Text(row, "slug"),
                Route("collections.show", Key(row), locale),
                Text(row, "title", Text(row, "slug")),
                Text(row, "description"),
                Text(row, "intro"),
                Timestamp(row, "published_at"),
                CollectionItems(db, Id(row, "id"), locale),
                RelatedCollections(db, Id(row, "id"), locale),
                Timestamp(row, "updated_at"),
                Timestamp(row, "created_at")
            ))
            .ToList();

    private static List<PublicTopic> Topics(PortfolioPublicDbContext context, string locale) =>
        TopicQueries
            .Topics(context, locale)
            .Select(row => new PublicTopic(
                row.Slug,
                row.Name ?? row.Slug,
                Route("topics.show", PublicRouteKey.Compose(row.PublicId, row.Slug), locale)
            ))
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
                    .Select(skill => new PublicTopic(
                        skill.Slug,
                        skill.Name ?? skill.Slug,
                        Route(
                            "topics.show",
                            PublicRouteKey.Compose(skill.PublicId, skill.Slug),
                            locale
                        )
                    ))
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

    private static List<PublicRelatedContent> RelatedCollections(
        DbConnection db,
        long id,
        string locale
    ) =>
        Rows(
                db,
                "select c.slug, c.public_id, t.title, c.published_at from reference_collections c left join reference_collection_translations t on t.reference_collection_id=c.id and t.locale=@locale where c.hidden=false and c.id<>@id order by c.published_at desc nulls last limit 3",
                ("@id", id),
                ("@locale", locale)
            )
            .Select(row => new PublicRelatedContent(
                Text(row, "title", Text(row, "slug")),
                Route("collections.show", Key(row), locale),
                Timestamp(row, "published_at")
            ))
            .ToList();

    private static List<PublicRelatedContent> RelatedFindings(
        DbConnection db,
        long id,
        string type,
        string locale
    )
    {
        var topic = Rows(
                db,
                "select topic_id from topicables where topicable_type='finding' and topicable_id=@id limit 1",
                ("@id", id)
            )
            .FirstOrDefault();
        var rows = topic is not null
            ? Rows(
                db,
                "select r.slug, r.public_id, t.title, r.published_date_iso from resources r left join resource_translations t on t.resource_id=r.id and t.locale=@locale where r.hidden=false and r.visibility='public' and r.id<>@id and exists (select 1 from topicables link where link.topic_id=@topic and link.topicable_type='finding' and link.topicable_id=r.id) order by r.published_date_iso desc nulls last limit 3",
                ("@id", id),
                ("@topic", Id(topic, "topic_id")),
                ("@locale", locale)
            )
            : [];
        if (rows.Count == 0)
            rows = Rows(
                db,
                "select r.slug, r.public_id, t.title, r.published_date_iso from resources r left join resource_translations t on t.resource_id=r.id and t.locale=@locale where r.hidden=false and r.visibility='public' and r.id<>@id and r.type=@type order by r.published_date_iso desc nulls last limit 3",
                ("@id", id),
                ("@type", type),
                ("@locale", locale)
            );
        return rows.Select(row => new PublicRelatedContent(
                Text(row, "title", Text(row, "slug")),
                Route("findings.show", Key(row), locale),
                Date(row, "published_date_iso")
            ))
            .ToList();
    }

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

    private static List<PublicCaseStudy> FeaturedCases(
        DbConnection db,
        PortfolioPublicDbContext context,
        string locale
    )
    {
        var all = Cases(context, locale)
            .ToDictionary(item => item.Slug, StringComparer.OrdinalIgnoreCase);
        return Rows(
                db,
                "select c.slug from pages p join page_featured_case x on x.page_id=p.id join case_studies c on c.id=x.case_study_id where p.slug='portfolio' and c.hidden=false and c.nda=false order by x.\"order\" nulls first limit 3",
                Array.Empty<(string Name, object Value)>()
            )
            .Select(row => all.GetValueOrDefault(Text(row, "slug")))
            .Where(item => item is not null)
            .Cast<PublicCaseStudy>()
            .ToList();
    }

    private static List<PublicProject> FeaturedProjects(
        DbConnection db,
        PortfolioPublicDbContext context,
        string locale
    )
    {
        var all = Projects(context, locale)
            .ToDictionary(item => item.Slug, StringComparer.OrdinalIgnoreCase);
        return Rows(
                db,
                "select p.slug from pages x join page_featured_project y on y.page_id=x.id join projects p on p.id=y.project_id where x.slug='portfolio' and p.hidden=false and p.nda=false order by y.\"order\" nulls first limit 3",
                Array.Empty<(string Name, object Value)>()
            )
            .Select(row => all.GetValueOrDefault(Text(row, "slug")))
            .Where(item => item is not null)
            .Cast<PublicProject>()
            .ToList();
    }

    private static List<PublicWriting> FeaturedWritings(
        DbConnection db,
        PortfolioPublicDbContext context,
        string locale
    )
    {
        var all = Writings(context, locale)
            .ToDictionary(item => item.Slug, StringComparer.OrdinalIgnoreCase);
        return Rows(
                db,
                "select w.slug from pages x join page_featured_writing y on y.page_id=x.id join writings w on w.id=y.writing_id where x.slug='portfolio' and w.hidden=false order by y.\"order\" nulls first",
                Array.Empty<(string Name, object Value)>()
            )
            .Select(row => all.GetValueOrDefault(Text(row, "slug")))
            .Where(item => item is not null)
            .Cast<PublicWriting>()
            .ToList();
    }

    private static JsonElement Resume(
        DbConnection db,
        PortfolioPublicDbContext context,
        string locale
    )
    {
        var row = Row(
            db,
            "select coalesce(t.id, en.id) as id, coalesce(t.resume_id, en.resume_id) as resume_id, coalesce(t.summary, en.summary) as summary, coalesce(t.leadership, en.leadership) as leadership, coalesce(t.education, en.education) as education, coalesce(t.certificates, en.certificates) as certificates, coalesce(t.certifications, en.certifications) as certifications, coalesce(t.publications, en.publications) as publications, coalesce(t.recommendations, en.recommendations) as recommendations, coalesce(t.technical_productions, en.technical_productions) as technical_productions, coalesce(t.events, en.events) as events, coalesce(t.awards, en.awards) as awards from resumes r left join resume_translations t on t.resume_id=r.id and t.locale=@locale left join resume_translations en on en.resume_id=r.id and en.locale='en' where t.id is not null or en.id is not null order by r.id nulls first limit 1",
            ("@locale", locale)
        );
        if (row.Count == 0)
            return JsonDocument.Parse("{}").RootElement.Clone();

        var fields = row.Where(pair =>
                pair.Key
                    is not "id"
                        and not "resume_id"
                        and not "locale"
                        and not "created_at"
                        and not "updated_at"
            )
            .ToDictionary(pair => pair.Key, pair => pair.Value, StringComparer.OrdinalIgnoreCase);
        foreach (
            var key in new[]
            {
                "leadership",
                "education",
                "certificates",
                "certifications",
                "publications",
                "recommendations",
                "technical_productions",
                "events",
                "awards",
            }
        )
        {
            if (
                fields.TryGetValue(key, out var value)
                && value is string json
                && !string.IsNullOrWhiteSpace(json)
            )
            {
                try
                {
                    fields[key] = JsonDocument.Parse(json).RootElement.Clone();
                }
                catch (JsonException)
                {
                    fields[key] = Array.Empty<object>();
                }
            }
        }

        var profile = Row(
            db,
            "select coalesce(t.trajectory, en.trajectory) as trajectory from profiles p left join profile_translations t on t.profile_id=p.id and t.locale=@locale left join profile_translations en on en.profile_id=p.id and en.locale='en' where t.id is not null or en.id is not null order by p.id nulls first limit 1",
            ("@locale", locale)
        );
        if (
            profile.TryGetValue("trajectory", out var trajectory)
            && trajectory is string trajectoryJson
            && !string.IsNullOrWhiteSpace(trajectoryJson)
        )
        {
            try
            {
                fields["experience"] = JsonDocument.Parse(trajectoryJson).RootElement.Clone();
            }
            catch (JsonException)
            {
                fields["experience"] = Array.Empty<object>();
            }
        }

        var resumeId = Id(row, "resume_id");
        if (resumeId > 0)
        {
            var selectedCases = Rows(
                    db,
                    "select c.slug from resume_selected_case x join case_studies c on c.id=x.case_study_id where x.resume_id=@id and c.hidden=false and c.nda=false order by x.\"order\" nulls first",
                    ("@id", resumeId)
                )
                .Select(item =>
                    Cases(context, locale).FirstOrDefault(value => value.Slug == Text(item, "slug"))
                )
                .Where(value => value is not null)
                .ToArray();
            fields["selected_cases"] = System.Text.Json.JsonSerializer.SerializeToElement(
                selectedCases
            );

            var skills = Rows(
                    db,
                    "select s.id, t.slug, coalesce(tt.name, en.name) as name from resume_skills s join topics t on t.id=s.topic_id left join topic_translations tt on tt.topic_id=t.id and tt.locale=@locale left join topic_translations en on en.topic_id=t.id and en.locale='en' where s.resume_id=@id order by s.\"order\" nulls first",
                    ("@id", resumeId),
                    ("@locale", locale)
                )
                .Select(item => new
                {
                    name = Text(item, "name", Text(item, "slug")),
                    technologies = TechnologiesFor(
                        db,
                        "resume_skill_technology",
                        "resume_skill_id",
                        Id(item, "id"),
                        locale
                    ),
                })
                .ToArray();
            fields["skills"] = System.Text.Json.JsonSerializer.SerializeToElement(skills);

            var languages = Rows(
                    db,
                    "select l.slug, coalesce(lt.name, en.name) as name, x.proficiency from resume_languages x join languages l on l.id=x.language_id left join language_translations lt on lt.language_id=l.id and lt.locale=@locale left join language_translations en on en.language_id=l.id and en.locale='en' where x.resume_id=@id order by x.\"order\" nulls first",
                    ("@id", resumeId),
                    ("@locale", locale)
                )
                .Select(item => new
                {
                    name = Text(item, "name", Text(item, "slug")),
                    proficiency = Text(item, "proficiency"),
                })
                .ToArray();
            fields["languages"] = System.Text.Json.JsonSerializer.SerializeToElement(languages);
        }

        return JsonDocument
            .Parse(System.Text.Json.JsonSerializer.Serialize(fields))
            .RootElement.Clone();
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

    private static List<PublicTechnology> TechnologiesFor(
        DbConnection db,
        string pivot,
        string key,
        long id,
        string locale
    ) =>
        Rows(
                db,
                $"select t.slug, t.public_id, coalesce(tt.name, en.name) as name from {pivot} p join technologies t on t.id=p.technology_id left join technology_translations tt on tt.technology_id=t.id and tt.locale=@locale left join technology_translations en on en.technology_id=t.id and en.locale='en' where p.{key}=@id order by t.\"order\" nulls first, t.slug nulls first",
                ("@id", id),
                ("@locale", locale)
            )
            .Select(row => new PublicTechnology(
                Text(row, "slug"),
                Text(row, "name", Text(row, "slug"))
            ))
            .ToList();

    private static List<PublicTopic> TopicsFor(
        DbConnection db,
        string kind,
        long id,
        string locale
    ) =>
        Rows(
                db,
                "select t.slug, t.public_id, coalesce(tt.name, en.name) as name from topicables x join topics t on t.id=x.topic_id left join topic_translations tt on tt.topic_id=t.id and tt.locale=@locale left join topic_translations en on en.topic_id=t.id and en.locale='en' where x.topicable_type=@kind and x.topicable_id=@id order by t.\"order\" nulls first",
                ("@kind", kind == "writing" ? "writing" : "finding"),
                ("@id", id),
                ("@locale", locale)
            )
            .Select(row => new PublicTopic(
                Text(row, "slug"),
                Text(row, "name", Text(row, "slug")),
                Route("topics.show", Key(row), locale)
            ))
            .ToList();

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

    private static List<PublicFindingLink> LinksFor(DbConnection db, long id) =>
        Rows(
                db,
                "select url, label, platform, purpose, is_free, is_primary from resource_links where resource_id=@id order by id nulls first",
                ("@id", id)
            )
            .Select(row => new PublicFindingLink(
                Text(row, "url"),
                Text(row, "label"),
                Text(row, "platform"),
                Text(row, "purpose"),
                Bool(row, "is_free"),
                Bool(row, "is_primary")
            ))
            .ToList();

    private static List<PublicTopic> AttributionTopicsFor(
        DbConnection db,
        long id,
        string locale
    ) =>
        Rows(
                db,
                "select distinct t.slug, t.public_id, coalesce(tt.name, en.name) as name, t.\"order\" from content_relations r join relation_types rt on rt.id=r.relation_type_id join topics t on t.id=r.object_id left join topic_translations tt on tt.topic_id=t.id and tt.locale=@locale left join topic_translations en on en.topic_id=t.id and en.locale='en' where r.subject_type='finding' and r.subject_id=@id and r.object_type='topic' and rt.key in ('authored-by', 'published-by') and (r.visibility is null or r.visibility='public') order by t.\"order\" nulls first, t.slug nulls first",
                ("@id", id),
                ("@locale", locale)
            )
            .Select(row => new PublicTopic(
                Text(row, "slug"),
                Text(row, "name", Text(row, "slug")),
                Route("topics.show", Key(row), locale)
            ))
            .ToList();

    private static List<PublicIdentifier> IdentifiersFor(DbConnection db, long id) =>
        Rows(
                db,
                "select kind, value from resource_identifiers where resource_id=@id order by id nulls first",
                ("@id", id)
            )
            .Select(row => new PublicIdentifier(Text(row, "kind"), Text(row, "value")))
            .ToList();

    private static List<PublicCollectionItem> CollectionItems(
        DbConnection db,
        long id,
        string locale
    ) =>
        Rows(
                db,
                "select r.slug, r.public_id, r.id, coalesce(t.title, en.title) as title, coalesce(t.description, en.description) as description, r.type, r.rating, x.note from reference_collection_item x join resources r on r.id=x.resource_id left join resource_translations t on t.resource_id=r.id and t.locale=@locale left join resource_translations en on en.resource_id=r.id and en.locale='en' where x.reference_collection_id=@id and r.hidden=false and r.visibility='public' order by x.\"order\" nulls first",
                ("@id", id),
                ("@locale", locale)
            )
            .Select(row => new PublicCollectionItem(
                Text(row, "slug"),
                Route("findings.show", Key(row), locale),
                Text(row, "title", Text(row, "slug")),
                Text(row, "description"),
                Text(row, "type"),
                Text(row, "rating"),
                Text(row, "note"),
                TopicsFor(db, "finding", Id(row, "id"), locale)
            ))
            .ToList();

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

    private static string Key(Dictionary<string, object?> row) =>
        PublicRouteKey.Compose(Text(row, "public_id"), Text(row, "slug"));

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
