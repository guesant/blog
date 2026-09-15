using System.Text.Json;
using System.Text.Json.Serialization;

namespace Blog.Blazor.Core;

public interface IPublicSiteContentProvider
{
    Task<PublicSiteSnapshot?> GetAsync(
        string locale,
        CancellationToken cancellationToken = default
    );

    Task<PublicProtectedEmailChallenge?> CreateEmailChallengeAsync(
        CancellationToken cancellationToken = default
    );
}

public interface IPublicKnowledgeGraphProvider
{
    Task<PublicKnowledgeGraph?> GetAsync(
        string locale,
        CancellationToken cancellationToken = default
    );
}

public sealed record PublicKnowledgeGraph(
    [property: JsonPropertyName("nodes")] List<PublicGraphNode> Nodes,
    [property: JsonPropertyName("edges")] List<PublicGraphEdge> Edges,
    [property: JsonPropertyName("kinds")] Dictionary<string, PublicGraphKind> Kinds
);

public sealed record PublicGraphNode(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("kind")] string Kind,
    [property: JsonPropertyName("label")] string Label,
    [property: JsonPropertyName("url")] string? Url,
    [property: JsonPropertyName("meta")] JsonElement Meta
);

public sealed record PublicGraphEdge(
    [property: JsonPropertyName("source")] string Source,
    [property: JsonPropertyName("target")] string Target,
    [property: JsonPropertyName("relationType")] string RelationType,
    [property: JsonPropertyName("label")] string Label,
    [property: JsonPropertyName("family")] string? Family = null,
    [property: JsonPropertyName("symmetric")] bool Symmetric = false,
    [property: JsonPropertyName("inboundLabel")] string? InboundLabel = null,
    [property: JsonPropertyName("note")] string? Note = null,
    [property: JsonPropertyName("context")] string? Context = null,
    [property: JsonPropertyName("status")] string? Status = null
);

public sealed record PublicGraphKind(
    [property: JsonPropertyName("label")] string Label,
    [property: JsonPropertyName("color")] string Color
);

public sealed record PublicHistoryEntry(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("label")] string Label,
    [property: JsonPropertyName("before")] Dictionary<string, string?> Before,
    [property: JsonPropertyName("after")] Dictionary<string, string?> After
);

public sealed record PublicSiteSnapshot(
    [property: JsonPropertyName("schema_version")] int SchemaVersion,
    [property: JsonPropertyName("locale")] string Locale,
    [property: JsonPropertyName("generated_at")] string GeneratedAt,
    [property: JsonPropertyName("chrome")] PublicChrome Chrome,
    [property: JsonPropertyName("pages")] Dictionary<string, JsonElement> Pages,
    [property: JsonPropertyName("projects")] List<PublicProject> Projects,
    [property: JsonPropertyName("cases")] List<PublicCaseStudy> Cases,
    [property: JsonPropertyName("writings")] List<PublicWriting> Writings,
    [property: JsonPropertyName("findings")] List<PublicFinding> Findings,
    [property: JsonPropertyName("collections")] List<PublicCollection> Collections,
    [property: JsonPropertyName("topics")] List<PublicTopic> Topics,
    [property: JsonPropertyName("technologies")] List<PublicTechnology> Technologies,
    [property: JsonPropertyName("experiments")] List<PublicExperiment> Experiments,
    [property: JsonPropertyName("snippets")] List<PublicSnippet> Snippets,
    [property: JsonPropertyName("credits")] List<PublicCredit> Credits,
    [property: JsonPropertyName("resume")] JsonElement Resume,
    [property: JsonPropertyName("featured_cases")] List<PublicCaseStudy>? FeaturedCases = null,
    [property: JsonPropertyName("featured_projects")] List<PublicProject>? FeaturedProjects = null,
    [property: JsonPropertyName("featured_writings")] List<PublicWriting>? FeaturedWritings = null,
    [property: JsonPropertyName("resume_pdf_locales")] List<string>? ResumePdfLocales = null
)
{
    public string HomeField(string name, string fallback = "")
    {
        if (
            !Pages.TryGetValue("home", out var home)
            || home.ValueKind != JsonValueKind.Object
            || !home.TryGetProperty(name, out var value)
            || value.ValueKind != JsonValueKind.String
        )
        {
            return fallback;
        }

        return value.GetString() ?? fallback;
    }
}

public sealed record PublicProject(
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("purpose")] string? Purpose,
    [property: JsonPropertyName("status")] string? Status,
    [property: JsonPropertyName("published_at")] string? PublishedAt,
    [property: JsonPropertyName("external")] bool External,
    [property: JsonPropertyName("problem")] string? Problem = null,
    [property: JsonPropertyName("current_focus")] string? CurrentFocus = null,
    [property: JsonPropertyName("metrics")] JsonElement? Metrics = null,
    [property: JsonPropertyName("body")] string? Body = null,
    [property: JsonPropertyName("technologies")] List<PublicTechnology>? Technologies = null,
    [property: JsonPropertyName("show_history")] bool ShowHistory = false,
    [property: JsonPropertyName("history")] List<PublicHistoryEntry>? History = null,
    [property: JsonPropertyName("href")] string? Href = null,
    [property: JsonPropertyName("related")] List<PublicRelatedContent>? Related = null,
    [property: JsonPropertyName("updated_at")] string? UpdatedAt = null
);

public sealed record PublicCaseStudy(
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("status")] string? Status,
    [property: JsonPropertyName("summary")] string? Summary,
    [property: JsonPropertyName("published_at")] string? PublishedAt,
    [property: JsonPropertyName("external")] bool External,
    [property: JsonPropertyName("meta")] string? Meta = null,
    [property: JsonPropertyName("context")] string? Context = null,
    [property: JsonPropertyName("role")] string? Role = null,
    [property: JsonPropertyName("result")] string? Result = null,
    [property: JsonPropertyName("metrics")] JsonElement? Metrics = null,
    [property: JsonPropertyName("body")] string? Body = null,
    [property: JsonPropertyName("technologies")] List<PublicTechnology>? Technologies = null,
    [property: JsonPropertyName("show_history")] bool ShowHistory = false,
    [property: JsonPropertyName("history")] List<PublicHistoryEntry>? History = null,
    [property: JsonPropertyName("href")] string? Href = null,
    [property: JsonPropertyName("related")] List<PublicRelatedContent>? Related = null,
    [property: JsonPropertyName("updated_at")] string? UpdatedAt = null
);

public sealed record PublicWriting(
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("excerpt")] string? Excerpt,
    [property: JsonPropertyName("reading_time")] string? ReadingTime,
    [property: JsonPropertyName("type")] string? Type,
    [property: JsonPropertyName("date")] string? Date,
    [property: JsonPropertyName("body")] string? Body = null,
    [property: JsonPropertyName("topics")] List<PublicTechnology>? Topics = null,
    [property: JsonPropertyName("show_history")] bool ShowHistory = false,
    [property: JsonPropertyName("history")] List<PublicHistoryEntry>? History = null,
    [property: JsonPropertyName("related")] List<PublicRelatedContent>? Related = null,
    [property: JsonPropertyName("updated_at")] string? UpdatedAt = null
);

public sealed record PublicFinding(
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("type")] string? Type,
    [property: JsonPropertyName("authors")] string? Authors,
    [property: JsonPropertyName("organizations")] string? Organizations,
    [property: JsonPropertyName("published_date")] string? PublishedDate,
    [property: JsonPropertyName("found_date")] string? FoundDate,
    [property: JsonPropertyName("rating")] string? Rating,
    [property: JsonPropertyName("consumption_state")] string? ConsumptionState,
    [property: JsonPropertyName("type_details")] JsonElement? TypeDetails,
    [property: JsonPropertyName("title")] string? Title,
    [property: JsonPropertyName("alternative_title")] string? AlternativeTitle,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("personal_note")] string? PersonalNote,
    [property: JsonPropertyName("reason_found")] string? ReasonFound,
    [property: JsonPropertyName("updated_date")] string? UpdatedDate,
    [property: JsonPropertyName("topics")] List<PublicTopic>? Topics,
    [property: JsonPropertyName("attribution_topics")] List<PublicTopic>? AttributionTopics,
    [property: JsonPropertyName("links")] List<PublicFindingLink>? Links,
    [property: JsonPropertyName("identifiers")] List<PublicIdentifier>? Identifiers,
    [property: JsonPropertyName("related")] List<PublicRelatedContent>? Related = null
);

public sealed record PublicTopic(
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("name")] string? Name,
    [property: JsonPropertyName("url")] string? Url = null
);

public sealed record PublicFindingLink(
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("label")] string? Label,
    [property: JsonPropertyName("platform")] string? Platform,
    [property: JsonPropertyName("purpose")] string? Purpose,
    [property: JsonPropertyName("is_free")] bool IsFree,
    [property: JsonPropertyName("is_primary")] bool IsPrimary = false
);

public sealed record PublicIdentifier(
    [property: JsonPropertyName("kind")] string? Kind,
    [property: JsonPropertyName("value")] string? Value
);

public sealed record PublicCollection(
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("intro")] string? Intro,
    [property: JsonPropertyName("published_at")] string? PublishedAt,
    [property: JsonPropertyName("resources")] List<PublicCollectionItem>? Resources,
    [property: JsonPropertyName("related")] List<PublicRelatedContent>? Related = null,
    [property: JsonPropertyName("updated_at")] string? UpdatedAt = null,
    [property: JsonPropertyName("created_at")] string? CreatedAt = null
);

public sealed record PublicCollectionItem(
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("type")] string? Type,
    [property: JsonPropertyName("rating")] string? Rating,
    [property: JsonPropertyName("note")] string? Note,
    [property: JsonPropertyName("topics")] List<PublicTopic>? Topics = null
);

public sealed record PublicTechnology(
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("code")] string? Code = null,
    [property: JsonPropertyName("url")] string? Url = null,
    [property: JsonPropertyName("skills")] List<string>? Skills = null,
    [property: JsonPropertyName("resume_skills")] List<PublicTopic>? ResumeSkills = null
);

public sealed record PublicExperiment(
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("purpose")] string? Purpose,
    [property: JsonPropertyName("body")] string? Body,
    [property: JsonPropertyName("published_at")] string? PublishedAt,
    [property: JsonPropertyName("external")] bool External,
    [property: JsonPropertyName("technologies")] List<PublicTechnology>? Technologies,
    [property: JsonPropertyName("href")] string? Href = null,
    [property: JsonPropertyName("updated_at")] string? UpdatedAt = null,
    [property: JsonPropertyName("show_history")] bool ShowHistory = false,
    [property: JsonPropertyName("history")] List<PublicHistoryEntry>? History = null,
    [property: JsonPropertyName("related")] List<PublicRelatedContent>? Related = null
);

public sealed record PublicRelatedContent(
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("date")] string? Date = null
);

public sealed record PublicSnippet(
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("published_at")] string? PublishedAt,
    [property: JsonPropertyName("files")] List<PublicSnippetFile>? Files,
    [property: JsonPropertyName("show_history")] bool ShowHistory = false,
    [property: JsonPropertyName("history")] List<PublicHistoryEntry>? History = null,
    [property: JsonPropertyName("related")] List<PublicRelatedContent>? Related = null,
    [property: JsonPropertyName("updated_at")] string? UpdatedAt = null
);

public sealed record PublicSnippetFile(
    [property: JsonPropertyName("path")] string Path,
    [property: JsonPropertyName("language")] string? Language,
    [property: JsonPropertyName("content")] string? Content,
    [property: JsonPropertyName("id")] string? Id = null,
    [property: JsonPropertyName("history")] List<PublicHistoryEntry>? History = null
);

public sealed record PublicCredit(
    [property: JsonPropertyName("category")] string Category,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("url")] string? Url,
    [property: JsonPropertyName("created_at")] string? CreatedAt = null
);

public sealed record PublicContactProfile(
    [property: JsonPropertyName("platform")] string Platform,
    [property: JsonPropertyName("label")] string Label,
    [property: JsonPropertyName("url")] string? Url
);

public sealed record PublicProtectedEmailChallenge(
    [property: JsonPropertyName("version")] int Version,
    [property: JsonPropertyName("algorithm")] string Algorithm,
    [property: JsonPropertyName("salt")] string Salt,
    [property: JsonPropertyName("iv")] string Iv,
    [property: JsonPropertyName("ciphertext")] string Ciphertext,
    [property: JsonPropertyName("params")] PublicProtectedEmailParameters Params
);

public sealed record PublicProtectedEmailParameters(
    [property: JsonPropertyName("memoryKib")] int MemoryKib,
    [property: JsonPropertyName("iterations")] int Iterations,
    [property: JsonPropertyName("parallelism")] int Parallelism,
    [property: JsonPropertyName("hashLength")] int HashLength
);

public sealed record PublicChrome(
    [property: JsonPropertyName("site")] PublicSite Site,
    [property: JsonPropertyName("profile")] PublicProfile? Profile,
    [property: JsonPropertyName("copyright")] string Copyright,
    [property: JsonPropertyName("navigation")] PublicNavigation Navigation,
    [property: JsonPropertyName("build")] PublicBuild Build,
    [property: JsonPropertyName("visibility")] PublicVisibility Visibility
);

public sealed record PublicVisibility(
    [property: JsonPropertyName("about")] bool About,
    [property: JsonPropertyName("resume")] bool Resume,
    [property: JsonPropertyName("portfolio")] bool Portfolio,
    [property: JsonPropertyName("cases")] bool Cases,
    [property: JsonPropertyName("contact")] bool Contact,
    [property: JsonPropertyName("license")] bool License,
    [property: JsonPropertyName("credits")] bool Credits,
    [property: JsonPropertyName("follow")] bool Follow,
    [property: JsonPropertyName("feed")] bool Feed,
    [property: JsonPropertyName("writing")] bool Writing,
    [property: JsonPropertyName("findings")] bool Findings,
    [property: JsonPropertyName("topics")] bool Topics,
    [property: JsonPropertyName("collections")] bool Collections,
    [property: JsonPropertyName("snippets")] bool Snippets,
    [property: JsonPropertyName("right_sidebar")] bool RightSidebar
)
{
    public static readonly PublicVisibility None = new(
        About: false,
        Resume: false,
        Portfolio: false,
        Cases: false,
        Contact: false,
        License: false,
        Credits: false,
        Follow: false,
        Feed: false,
        Writing: false,
        Findings: false,
        Topics: false,
        Collections: false,
        Snippets: false,
        RightSidebar: false
    );
}

public sealed record PublicSite(
    [property: JsonPropertyName("short_name")] string? ShortName,
    [property: JsonPropertyName("portfolio_url")] string? PortfolioUrl,
    [property: JsonPropertyName("source_repository_url")] string? SourceRepositoryUrl,
    [property: JsonPropertyName("contact_available")] bool ContactAvailable,
    [property: JsonPropertyName("contact_profiles")]
        List<PublicContactProfile>? ContactProfiles = null,
    [property: JsonPropertyName("protected_email")]
        PublicProtectedEmailChallenge? ProtectedEmail = null,
    [property: JsonPropertyName("maintenance_enabled")] bool MaintenanceEnabled = false,
    [property: JsonPropertyName("maintenance_eyebrow")] string? MaintenanceEyebrow = null,
    [property: JsonPropertyName("maintenance_title")] string? MaintenanceTitle = null,
    [property: JsonPropertyName("maintenance_description")] string? MaintenanceDescription = null,
    [property: JsonPropertyName("seo")] JsonElement? Seo = null
);

public sealed record PublicProfile(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("title")] string? Title,
    [property: JsonPropertyName("location")] string? Location,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("milestones")] JsonElement? Milestones = null,
    [property: JsonPropertyName("birth_date")] string? BirthDate = null,
    [property: JsonPropertyName("birth_city")] string? BirthCity = null,
    [property: JsonPropertyName("interests")] string? Interests = null,
    [property: JsonPropertyName("learning")] string? Learning = null,
    [property: JsonPropertyName("personal_interests")] JsonElement? PersonalInterests = null
);

public sealed record PublicNavigation(
    [property: JsonPropertyName("sidebar")] List<List<PublicNavigationItem>> Sidebar,
    [property: JsonPropertyName("footer_links")] List<PublicNavigationItem> FooterLinks,
    [property: JsonPropertyName("sitemap")] List<PublicNavigationItem>? Sitemap = null
);

public sealed record PublicNavigationItem(
    [property: JsonPropertyName("route")] string Route,
    [property: JsonPropertyName("label")] string? Label,
    [property: JsonPropertyName("children")] List<PublicNavigationItem>? Children = null
);

public sealed record PublicBuild(
    [property: JsonPropertyName("commit_sha")] string? CommitSha,
    [property: JsonPropertyName("build_time")] string? BuildTime
);
