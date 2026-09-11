using System.Collections.Concurrent;
using System.Data.Common;
using System.Text.Json;
using Microsoft.Extensions.Localization;
using Portfolio.Blazor.Core;
using Portfolio.Blazor.Core.Localization;
using Portfolio.Blazor.Data.Providers;
using static Portfolio.Blazor.SqlReadHelpers;

namespace Portfolio.Blazor;

public sealed partial class PublicSiteContentProvider(
    IDatabaseProvider database,
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
                var snapshot = Build(connection, locale);
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

    private PublicSiteSnapshot Build(DbConnection db, string locale)
    {
        var site = Row(db, "select * from site_settings order by id nulls first limit 1");
        var profile = Row(
            db,
            "select p.*, coalesce(t.title, en.title) as title, coalesce(t.location, en.location) as location, coalesce(t.description, en.description) as description, coalesce(t.milestones, en.milestones) as milestones from profiles p left join profile_translations t on t.profile_id=p.id and t.locale=@locale left join profile_translations en on en.profile_id=p.id and en.locale='en' order by p.id nulls first limit 1",
            ("@locale", locale)
        );
        var pages = Rows(
                db,
                "select p.slug, p.updated_at, coalesce(t.fields, en.fields) as fields from pages p left join page_translations t on t.page_id=p.id and t.locale=@locale left join page_translations en on en.page_id=p.id and en.locale='en' where t.id is not null or en.id is not null",
                ("@locale", locale)
            )
            .ToDictionary(row => Text(row, "slug"), PageFields, StringComparer.OrdinalIgnoreCase);

        var chrome = new PublicChrome(
            new PublicSite(
                Text(site, "short_name"),
                Text(site, "portfolio_url"),
                Text(site, "source_repository_url"),
                Bool(site, "contact_available"),
                ContactProfiles(db, site, locale),
                null,
                Bool(site, "maintenance_enabled"),
                MaintenanceField(db, site, locale, "maintenance_eyebrow"),
                MaintenanceField(db, site, locale, "maintenance_title"),
                MaintenanceField(db, site, locale, "maintenance_description"),
                SiteSeo(db, site, locale)
            ),
            profile.Count == 0
                ? null
                : new PublicProfile(
                    Text(profile, "name"),
                    Text(profile, "title"),
                    Text(profile, "location"),
                    Text(profile, "description"),
                    JsonNullable(Text(profile, "milestones")),
                    Date(profile, "birth_date"),
                    Text(profile, "birth_city"),
                    Text(profile, "interests"),
                    Text(profile, "learning"),
                    JsonNullable(Text(profile, "personal_interests"))
                ),
            Copyright(db, site, profile, locale),
            Navigation(db, locale),
            new PublicBuild(_commitSha, _buildTime)
        );

        return new PublicSiteSnapshot(
            1,
            locale,
            DateTimeOffset.UtcNow.ToString("O"),
            chrome,
            pages,
            Projects(db, locale),
            Cases(db, locale),
            Writings(db, locale),
            Findings(db, locale),
            Collections(db, locale),
            Topics(db, locale),
            Technologies(db, locale),
            Experiments(db, locale),
            Snippets(db, locale),
            Credits(db, locale),
            Resume(db, locale),
            FeaturedCases(db, locale),
            FeaturedProjects(db, locale),
            FeaturedWritings(db, locale),
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

        using var connection = await database.OpenReadOnlyConnectionAsync(cancellationToken);
        var site = Row(
            connection,
            "select contact_email from site_settings order by id nulls first limit 1"
        );
        return await challengeService.CreateAsync(Text(site, "contact_email"), cancellationToken);
    }

    private List<string> ResumePdfLocales() =>
        new[] { "en", "pt-BR" }
            .Where(locale =>
                File.Exists(Path.Combine(_resumePdfRoot, $"resume-{locale}.pdf"))
                || File.Exists(Path.Combine(_publicAssetRoot, $"resume-{locale}.pdf"))
            )
            .ToList();

    private static List<PublicProject> Projects(DbConnection db, string locale) =>
        Rows(
                db,
                "select p.*, coalesce(t.name, en.name) as name, coalesce(t.purpose, en.purpose) as purpose, coalesce(t.problem, en.problem) as problem, coalesce(t.current_focus, en.current_focus) as current_focus, coalesce(t.status, en.status) as status, coalesce(t.metrics, en.metrics) as metrics, coalesce(t.body, en.body) as body from projects p left join project_translations t on t.project_id=p.id and t.locale=@locale left join project_translations en on en.project_id=p.id and en.locale='en' where p.hidden=false and p.nda=false order by p.\"order\" nulls first",
                ("@locale", locale)
            )
            .Select(row => new PublicProject(
                Text(row, "slug"),
                Route("projects.show", Key(row), locale),
                Text(row, "name", Text(row, "slug")),
                Text(row, "purpose"),
                Text(row, "status"),
                Timestamp(row, "published_at"),
                Bool(row, "external"),
                Text(row, "problem"),
                Text(row, "current_focus"),
                JsonNullable(Text(row, "metrics")),
                Text(row, "body"),
                TechnologiesFor(db, "project_technology", "project_id", Id(row, "id"), locale),
                Bool(row, "show_history"),
                HistoryFor(db, "App\\Models\\Project", Id(row, "id"), locale),
                Text(row, "href"),
                RelatedProjects(db, Id(row, "id"), locale),
                Timestamp(row, "updated_at")
            ))
            .ToList();

    private static List<PublicCaseStudy> Cases(DbConnection db, string locale) =>
        Rows(
                db,
                "select c.*, coalesce(t.title, en.title) as title, coalesce(t.status, en.status) as status, coalesce(t.meta, en.meta) as meta, coalesce(t.summary, en.summary) as summary, coalesce(t.context, en.context) as context, coalesce(t.role, en.role) as role, coalesce(t.result, en.result) as result, coalesce(t.metrics, en.metrics) as metrics, coalesce(t.body, en.body) as body from case_studies c left join case_study_translations t on t.case_study_id=c.id and t.locale=@locale left join case_study_translations en on en.case_study_id=c.id and en.locale='en' where c.hidden=false and c.nda=false order by c.\"order\" nulls first",
                ("@locale", locale)
            )
            .Select(row => new PublicCaseStudy(
                Text(row, "slug"),
                Route("cases.show", Key(row), locale),
                Text(row, "title", Text(row, "slug")),
                Text(row, "status"),
                Text(row, "summary"),
                Timestamp(row, "published_at"),
                Bool(row, "external"),
                Text(row, "meta"),
                Text(row, "context"),
                Text(row, "role"),
                Text(row, "result"),
                JsonNullable(Text(row, "metrics")),
                Text(row, "body"),
                TechnologiesFor(
                    db,
                    "case_study_technology",
                    "case_study_id",
                    Id(row, "id"),
                    locale
                ),
                Bool(row, "show_history"),
                HistoryFor(db, "App\\Models\\CaseStudy", Id(row, "id"), locale),
                Text(row, "href"),
                RelatedCases(db, Id(row, "id"), locale),
                Timestamp(row, "updated_at")
            ))
            .ToList();

    private static List<PublicWriting> Writings(DbConnection db, string locale) =>
        Rows(
                db,
                "select w.*, coalesce(t.title, en.title) as title, coalesce(t.excerpt, en.excerpt) as excerpt, coalesce(t.reading_time, en.reading_time) as reading_time, coalesce(t.body, en.body) as body from writings w left join writing_translations t on t.writing_id=w.id and t.locale=@locale left join writing_translations en on en.writing_id=w.id and en.locale='en' where w.hidden=false order by w.date_iso desc nulls last",
                ("@locale", locale)
            )
            .Select(row => new PublicWriting(
                Text(row, "slug"),
                Route("writing.show", Key(row), locale),
                Text(row, "title", Text(row, "slug")),
                Text(row, "excerpt"),
                Text(row, "reading_time"),
                Text(row, "type"),
                Date(row, "date_iso"),
                Text(row, "body"),
                TopicsFor(db, "writing", Id(row, "id"), locale)
                    .Select(topic => new PublicTechnology(
                        topic.Slug,
                        topic.Name ?? topic.Slug,
                        Url: topic.Url
                    ))
                    .ToList(),
                Bool(row, "show_history"),
                HistoryFor(db, "App\\Models\\Writing", Id(row, "id"), locale),
                RelatedWritings(db, Id(row, "id"), locale),
                Timestamp(row, "updated_at")
            ))
            .ToList();

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

    private static List<PublicTopic> Topics(DbConnection db, string locale) =>
        Rows(
                db,
                "select t.*, coalesce(tt.name, en.name) as name from topics t left join topic_translations tt on tt.topic_id=t.id and tt.locale=@locale left join topic_translations en on en.topic_id=t.id and en.locale='en' order by t.\"order\" nulls first",
                ("@locale", locale)
            )
            .Select(row => new PublicTopic(
                Text(row, "slug"),
                Text(row, "name", Text(row, "slug")),
                Route("topics.show", Key(row), locale)
            ))
            .ToList();

    private static List<PublicTechnology> Technologies(DbConnection db, string locale) =>
        Rows(
                db,
                "select t.*, coalesce(tt.name, en.name) as name from technologies t left join technology_translations tt on tt.technology_id=t.id and tt.locale=@locale left join technology_translations en on en.technology_id=t.id and en.locale='en' order by t.\"order\" nulls first",
                ("@locale", locale)
            )
            .Select(row => new PublicTechnology(
                Text(row, "slug"),
                Text(row, "name", Text(row, "slug")),
                Text(row, "code"),
                Route("technologies.show", Key(row), locale),
                SkillsFor(db, Id(row, "id"), locale),
                ResumeSkillTopicsFor(db, Id(row, "id"), locale)
            ))
            .ToList();

    private static List<PublicExperiment> Experiments(DbConnection db, string locale) =>
        Rows(
                db,
                "select e.*, coalesce(t.name, en.name) as name, coalesce(t.purpose, en.purpose) as purpose, coalesce(t.body, en.body) as body from experiments e left join experiment_translations t on t.experiment_id=e.id and t.locale=@locale left join experiment_translations en on en.experiment_id=e.id and en.locale='en' where e.hidden=false order by e.\"order\" nulls first",
                ("@locale", locale)
            )
            .Select(row => new PublicExperiment(
                Text(row, "slug"),
                Route("projects.experiments.show", Key(row), locale),
                Text(row, "name", Text(row, "slug")),
                Text(row, "purpose"),
                Text(row, "body"),
                Timestamp(row, "published_at"),
                Bool(row, "external"),
                TechnologiesFor(
                    db,
                    "experiment_technology",
                    "experiment_id",
                    Id(row, "id"),
                    locale
                ),
                Text(row, "href"),
                Timestamp(row, "updated_at"),
                Bool(row, "show_history"),
                HistoryFor(db, "App\\Models\\Experiment", Id(row, "id"), locale),
                RelatedExperiments(db, Id(row, "id"), locale)
            ))
            .ToList();

    private static List<PublicRelatedContent> RelatedExperiments(
        DbConnection db,
        long id,
        string locale
    )
    {
        const string shared =
            "select e.slug, e.public_id, t.name, e.published_at from experiments e left join experiment_translations t on t.experiment_id=e.id and t.locale=@locale where e.hidden=false and e.id<>@id and exists (select 1 from experiment_technology current_technology join experiment_technology related_technology on related_technology.technology_id=current_technology.technology_id where current_technology.experiment_id=@id and related_technology.experiment_id=e.id) order by e.published_at desc nulls last limit 3";
        var rows = Rows(db, shared, ("@id", id), ("@locale", locale));
        if (rows.Count == 0)
            rows = Rows(
                db,
                "select e.slug, e.public_id, t.name, e.published_at from experiments e left join experiment_translations t on t.experiment_id=e.id and t.locale=@locale where e.hidden=false and e.id<>@id order by e.published_at desc nulls last limit 3",
                ("@id", id),
                ("@locale", locale)
            );
        return rows.Select(row => new PublicRelatedContent(
                Text(row, "name", Text(row, "slug")),
                Route("projects.experiments.show", Key(row), locale),
                Timestamp(row, "published_at")
            ))
            .ToList();
    }

    private static List<PublicRelatedContent> RelatedProjects(
        DbConnection db,
        long id,
        string locale
    )
    {
        const string shared =
            "select p.slug, p.public_id, t.name, p.published_at from projects p left join project_translations t on t.project_id=p.id and t.locale=@locale where p.hidden=false and p.nda=false and p.id<>@id and exists (select 1 from project_technology current_technology join project_technology related_technology on related_technology.technology_id=current_technology.technology_id where current_technology.project_id=@id and related_technology.project_id=p.id) order by p.published_at desc nulls last limit 3";
        var rows = Rows(db, shared, ("@id", id), ("@locale", locale));
        if (rows.Count == 0)
            rows = Rows(
                db,
                "select p.slug, p.public_id, t.name, p.published_at from projects p left join project_translations t on t.project_id=p.id and t.locale=@locale where p.hidden=false and p.nda=false and p.id<>@id order by p.published_at desc nulls last limit 3",
                ("@id", id),
                ("@locale", locale)
            );
        return rows.Select(row => new PublicRelatedContent(
                Text(row, "name", Text(row, "slug")),
                Route("projects.show", Key(row), locale),
                Timestamp(row, "published_at")
            ))
            .ToList();
    }

    private static List<PublicRelatedContent> RelatedCases(DbConnection db, long id, string locale)
    {
        const string shared =
            "select c.slug, c.public_id, t.title, c.published_at from case_studies c left join case_study_translations t on t.case_study_id=c.id and t.locale=@locale where c.hidden=false and c.nda=false and c.id<>@id and exists (select 1 from case_study_technology current_technology join case_study_technology related_technology on related_technology.technology_id=current_technology.technology_id where current_technology.case_study_id=@id and related_technology.case_study_id=c.id) order by c.published_at desc nulls last limit 3";
        var rows = Rows(db, shared, ("@id", id), ("@locale", locale));
        if (rows.Count == 0)
            rows = Rows(
                db,
                "select c.slug, c.public_id, t.title, c.published_at from case_studies c left join case_study_translations t on t.case_study_id=c.id and t.locale=@locale where c.hidden=false and c.nda=false and c.id<>@id order by c.published_at desc nulls last limit 3",
                ("@id", id),
                ("@locale", locale)
            );
        return rows.Select(row => new PublicRelatedContent(
                Text(row, "title", Text(row, "slug")),
                Route("cases.show", Key(row), locale),
                Timestamp(row, "published_at")
            ))
            .ToList();
    }

    private static List<PublicRelatedContent> RelatedWritings(
        DbConnection db,
        long id,
        string locale
    )
    {
        var topic = Rows(
                db,
                "select topic_id from topicables where topicable_type='writing' and topicable_id=@id limit 1",
                ("@id", id)
            )
            .FirstOrDefault();
        if (topic is null)
            return [];
        var topicId = Id(topic, "topic_id");
        return Rows(
                db,
                "select w.slug, w.public_id, t.title, w.date_iso from writings w left join writing_translations t on t.writing_id=w.id and t.locale=@locale where w.hidden=false and w.id<>@id and exists (select 1 from topicables link where link.topic_id=@topic and link.topicable_type='writing' and link.topicable_id=w.id) order by w.date_iso desc nulls last limit 3",
                ("@id", id),
                ("@topic", topicId),
                ("@locale", locale)
            )
            .Select(row => new PublicRelatedContent(
                Text(row, "title", Text(row, "slug")),
                Route("writing.show", Key(row), locale),
                Date(row, "date_iso")
            ))
            .ToList();
    }

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

    private static List<PublicRelatedContent> RelatedSnippets(
        DbConnection db,
        long id,
        string locale
    ) =>
        Rows(
                db,
                "select s.slug, s.public_id, t.title, s.published_at from snippets s left join snippet_translations t on t.snippet_id=s.id and t.locale=@locale where s.hidden=false and s.id<>@id order by s.published_at desc nulls last limit 3",
                ("@id", id),
                ("@locale", locale)
            )
            .Select(row => new PublicRelatedContent(
                Text(row, "title", Text(row, "slug")),
                Route("snippets.show", Key(row), locale),
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

    private static List<PublicSnippet> Snippets(DbConnection db, string locale) =>
        Rows(
                db,
                "select s.*, coalesce(t.title, en.title) as title, coalesce(t.description, en.description) as description from snippets s left join snippet_translations t on t.snippet_id=s.id and t.locale=@locale left join snippet_translations en on en.snippet_id=s.id and en.locale='en' where s.hidden=false order by s.\"order\" nulls first",
                ("@locale", locale)
            )
            .Select(row => new PublicSnippet(
                Text(row, "slug"),
                Route("snippets.show", Key(row), locale),
                Text(row, "title", Text(row, "slug")),
                Text(row, "description"),
                Timestamp(row, "published_at"),
                Rows(
                        db,
                        "select id, path, language, content from snippet_files where snippet_id=@id order by \"order\" nulls first",
                        ("@id", Id(row, "id"))
                    )
                    .Select(file => new PublicSnippetFile(
                        Text(file, "path"),
                        Text(file, "language"),
                        Text(file, "content"),
                        Text(file, "id"),
                        HistoryFor(db, "App\\Models\\SnippetFile", Id(file, "id"), locale)
                    ))
                    .ToList(),
                Bool(row, "show_history"),
                HistoryFor(db, "App\\Models\\Snippet", Id(row, "id"), locale),
                RelatedSnippets(db, Id(row, "id"), locale),
                Timestamp(row, "updated_at")
            ))
            .ToList();

    private static List<PublicCredit> Credits(DbConnection db, string locale) =>
        Rows(
                db,
                "select c.*, coalesce(t.name, en.name) as name, coalesce(t.description, en.description) as description from credit_entries c left join credit_entry_translations t on t.credit_entry_id=c.id and t.locale=@locale left join credit_entry_translations en on en.credit_entry_id=c.id and en.locale='en' where c.active=true order by c.category nulls first, c.\"order\" nulls first",
                ("@locale", locale)
            )
            .Select(row => new PublicCredit(
                Text(row, "category"),
                Text(row, "name", Text(row, "category")),
                Text(row, "description"),
                Text(row, "url"),
                Timestamp(row, "created_at")
            ))
            .ToList();

    private static List<PublicCaseStudy> FeaturedCases(DbConnection db, string locale)
    {
        var all = Cases(db, locale)
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

    private static List<PublicProject> FeaturedProjects(DbConnection db, string locale)
    {
        var all = Projects(db, locale)
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

    private static List<PublicWriting> FeaturedWritings(DbConnection db, string locale)
    {
        var all = Writings(db, locale)
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

    private static JsonElement Resume(DbConnection db, string locale)
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
                    Cases(db, locale).FirstOrDefault(value => value.Slug == Text(item, "slug"))
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

    private static JsonElement PageFields(Dictionary<string, object?> row)
    {
        var fields = Json(Text(row, "fields"));
        if (
            fields.ValueKind != JsonValueKind.Object
            || string.IsNullOrWhiteSpace(Timestamp(row, "updated_at"))
        )
            return fields;
        var values = fields
            .EnumerateObject()
            .ToDictionary(
                item => item.Name,
                item => item.Value.Clone(),
                StringComparer.OrdinalIgnoreCase
            );
        values["updated_at"] = JsonSerializer.SerializeToElement(Timestamp(row, "updated_at"));
        return JsonDocument.Parse(JsonSerializer.Serialize(values)).RootElement.Clone();
    }

    private static JsonElement Json(DbConnection db, Dictionary<string, object?> row)
    {
        var fields = row.Where(pair =>
                pair.Key
                    is not "id"
                        and not "resume_id"
                        and not "locale"
                        and not "created_at"
                        and not "updated_at"
            )
            .ToDictionary(pair => pair.Key, pair => pair.Value);
        return JsonDocument
            .Parse(System.Text.Json.JsonSerializer.Serialize(fields))
            .RootElement.Clone();
    }

    private static List<PublicContactProfile> ContactProfiles(
        DbConnection db,
        Dictionary<string, object?> site,
        string locale
    )
    {
        var profiles = Rows(
                db,
                "select platform, label, url from contact_profiles where site_settings_id=@id order by \"order\" nulls first",
                ("@id", Id(site, "id"))
            )
            .Select(row => new PublicContactProfile(
                Text(row, "platform"),
                Text(row, "label", Text(row, "platform")),
                Text(row, "url")
            ))
            .ToList();
        return profiles;
    }

    private static string? MaintenanceField(
        DbConnection db,
        Dictionary<string, object?> site,
        string locale,
        string field
    ) =>
        Text(
            Row(
                db,
                $"select coalesce(t.{field}, en.{field}) as {field} from site_settings_translations t left join site_settings_translations en on en.site_settings_id=t.site_settings_id and en.locale='en' where t.site_settings_id=@id and t.locale=@locale limit 1",
                ("@id", Id(site, "id")),
                ("@locale", locale)
            ),
            field,
            string.Empty
        )
            is var value
        && value.Length > 0
            ? value
            : null;

    private static JsonElement? SiteSeo(
        DbConnection db,
        Dictionary<string, object?> site,
        string locale
    ) =>
        JsonNullable(
            Text(
                Row(
                    db,
                    "select coalesce(t.seo, en.seo) as seo from site_settings_translations t left join site_settings_translations en on en.site_settings_id=t.site_settings_id and en.locale='en' where t.site_settings_id=@id and t.locale=@locale limit 1",
                    ("@id", Id(site, "id")),
                    ("@locale", locale)
                ),
                "seo"
            )
        );

    private string Copyright(
        DbConnection db,
        Dictionary<string, object?> site,
        Dictionary<string, object?> profile,
        string locale
    )
    {
        var template = Text(
            Row(
                db,
                "select copyright_template from site_settings_translations where site_settings_id=@id and locale=@locale limit 1",
                ("@id", Id(site, "id")),
                ("@locale", locale)
            ),
            "copyright_template",
            localizer["some_rights_reserved"].Value
        );
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
        var name = Text(profile, "name", Text(site, "short_name"));
        return template.Replace("{year}", DateTime.UtcNow.Year.ToString()).Replace("{name}", name);
    }

    private static List<PublicNavigationItem> NavigationRoots(
        IEnumerable<Dictionary<string, object?>> rows,
        string locale,
        Func<Dictionary<string, object?>, bool> predicate
    )
    {
        var allRows = rows.ToList();
        return allRows
            .Where(row => string.IsNullOrWhiteSpace(Text(row, "parent_id")) && predicate(row))
            .Select(row => new PublicNavigationItem(
                Route(Text(row, "route_name"), "", locale),
                Text(row, "label"),
                allRows
                    .Where(child => Text(child, "parent_id") == Text(row, "id"))
                    .Select(child => new PublicNavigationItem(
                        Route(Text(child, "route_name"), "", locale),
                        Text(child, "label")
                    ))
                    .GroupBy(child => child.Route, StringComparer.OrdinalIgnoreCase)
                    .Select(group => group.First())
                    .ToList()
            ))
            .GroupBy(item => item.Route, StringComparer.OrdinalIgnoreCase)
            .Select(group => group.First())
            .ToList();
    }

    private static PublicNavigation Navigation(DbConnection db, string locale)
    {
        var rows = Rows(
            db,
            "select n.*, coalesce(t.label, en.label) as label from nav_items n left join nav_item_translations t on t.nav_item_id=n.id and t.locale=@locale left join nav_item_translations en on en.nav_item_id=n.id and en.locale='en' order by n.sidebar_group nulls first, n.\"order\" nulls first",
            ("@locale", locale)
        );
        var sidebarRoots = rows.Where(row =>
                string.IsNullOrWhiteSpace(Text(row, "parent_id"))
                && Text(row, "placement") == "sidebar"
            )
            .ToList();
        var sidebarItems = NavigationRoots(
            rows,
            locale,
            row => Text(row, "placement") == "sidebar"
        );
        var groups = sidebarRoots
            .Where(row => Text(row, "sidebar_group").Length > 0)
            .GroupBy(row => Text(row, "sidebar_group"))
            .OrderBy(group => group.Key)
            .Select(group =>
                sidebarItems
                    .Where(item =>
                        group.Any(row => Route(Text(row, "route_name"), "", locale) == item.Route)
                    )
                    .ToList()
            )
            .Where(group => group.Count > 0)
            .ToList();
        var footerLinks = NavigationRoots(
            rows,
            locale,
            row => Text(row, "placement") == "footer_links"
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

    private static List<string> SkillsFor(DbConnection db, long technologyId, string locale) =>
        Rows(
                db,
                "select coalesce(tt.name, en.name) as name from resume_skill_technology x join resume_skills s on s.id=x.resume_skill_id join topics t on t.id=s.topic_id left join topic_translations tt on tt.topic_id=t.id and tt.locale=@locale left join topic_translations en on en.topic_id=t.id and en.locale='en' where x.technology_id=@id order by s.\"order\" nulls first",
                ("@id", technologyId),
                ("@locale", locale)
            )
            .Select(row => Text(row, "name"))
            .Where(value => value.Length > 0)
            .ToList();

    private static List<PublicTopic> ResumeSkillTopicsFor(
        DbConnection db,
        long technologyId,
        string locale
    ) =>
        Rows(
                db,
                "select t.slug, t.public_id, coalesce(tt.name, en.name) as name from resume_skill_technology x join resume_skills s on s.id=x.resume_skill_id join topics t on t.id=s.topic_id left join topic_translations tt on tt.topic_id=t.id and tt.locale=@locale left join topic_translations en on en.topic_id=t.id and en.locale='en' where x.technology_id=@id order by s.\"order\" nulls first, t.\"order\" nulls first",
                ("@id", technologyId),
                ("@locale", locale)
            )
            .Select(row => new PublicTopic(
                Text(row, "slug"),
                Text(row, "name", Text(row, "slug")),
                Route("topics.show", Key(row), locale)
            ))
            .GroupBy(topic => topic.Slug, StringComparer.OrdinalIgnoreCase)
            .Select(group => group.First())
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

    private static List<PublicHistoryEntry> HistoryFor(
        DbConnection db,
        string auditableType,
        long id,
        string locale
    )
    {
        var translation = auditableType switch
        {
            "App\\Models\\Project" => (
                Type: "App\\Models\\ProjectTranslation",
                Table: "project_translations",
                ForeignKey: "project_id"
            ),
            "App\\Models\\CaseStudy" => (
                Type: "App\\Models\\CaseStudyTranslation",
                Table: "case_study_translations",
                ForeignKey: "case_study_id"
            ),
            "App\\Models\\Writing" => (
                Type: "App\\Models\\WritingTranslation",
                Table: "writing_translations",
                ForeignKey: "writing_id"
            ),
            "App\\Models\\Experiment" => (
                Type: "App\\Models\\ExperimentTranslation",
                Table: "experiment_translations",
                ForeignKey: "experiment_id"
            ),
            "App\\Models\\Snippet" => (
                Type: "App\\Models\\SnippetTranslation",
                Table: "snippet_translations",
                ForeignKey: "snippet_id"
            ),
            _ => (Type: auditableType, Table: string.Empty, ForeignKey: string.Empty),
        };
        var query = string.IsNullOrWhiteSpace(translation.Table)
            ? "select id, created_at, old_values, new_values from audit_log where auditable_type=@type and auditable_id=@id and action='updated' order by created_at nulls first, id nulls first"
            : $"select id, created_at, old_values, new_values from audit_log where auditable_type=@type and auditable_id in (select id from {translation.Table} where {translation.ForeignKey}=@id and locale=@locale) and action='updated' order by created_at nulls first, id nulls first";
        return Rows(db, query, ("@type", translation.Type), ("@id", id), ("@locale", locale))
            .Select(row => new PublicHistoryEntry(
                Text(row, "id"),
                Timestamp(row, "created_at", Text(row, "id")),
                Values(Text(row, "old_values")),
                Values(Text(row, "new_values"))
            ))
            .ToList();
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
