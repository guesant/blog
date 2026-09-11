using Microsoft.EntityFrameworkCore;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data;

// IMPORTANT: this is the only context the public site reads through. The query filters applied in
// PublicVisibilityFilters are what keep hidden, NDA, non-public and inactive rows off the public
// site, by construction; disabling those filters is forbidden in the runtime by
// tools/scripts/verify-hidden-content.sh, and the connection is opened read-only by the provider.
public sealed class PortfolioPublicDbContext(DbContextOptions<PortfolioPublicDbContext> options)
    : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectTranslation> ProjectTranslations => Set<ProjectTranslation>();
    public DbSet<ProjectTechnology> ProjectTechnologies => Set<ProjectTechnology>();
    public DbSet<CaseStudy> CaseStudies => Set<CaseStudy>();
    public DbSet<CaseStudyTranslation> CaseStudyTranslations => Set<CaseStudyTranslation>();
    public DbSet<CaseStudyTechnology> CaseStudyTechnologies => Set<CaseStudyTechnology>();
    public DbSet<Technology> Technologies => Set<Technology>();
    public DbSet<TechnologyTranslation> TechnologyTranslations => Set<TechnologyTranslation>();
    public DbSet<Experiment> Experiments => Set<Experiment>();
    public DbSet<ExperimentTranslation> ExperimentTranslations => Set<ExperimentTranslation>();
    public DbSet<ExperimentTechnology> ExperimentTechnologies => Set<ExperimentTechnology>();
    public DbSet<CreditEntry> CreditEntries => Set<CreditEntry>();
    public DbSet<CreditEntryTranslation> CreditEntryTranslations => Set<CreditEntryTranslation>();
    public DbSet<Topic> Topics => Set<Topic>();
    public DbSet<TopicTranslation> TopicTranslations => Set<TopicTranslation>();
    public DbSet<Language> Languages => Set<Language>();
    public DbSet<LanguageTranslation> LanguageTranslations => Set<LanguageTranslation>();
    public DbSet<Writing> Writings => Set<Writing>();
    public DbSet<WritingTranslation> WritingTranslations => Set<WritingTranslation>();
    public DbSet<Snippet> Snippets => Set<Snippet>();
    public DbSet<SnippetTranslation> SnippetTranslations => Set<SnippetTranslation>();
    public DbSet<SnippetFile> SnippetFiles => Set<SnippetFile>();
    public DbSet<Topicable> Topicables => Set<Topicable>();
    public DbSet<ReferenceCollection> ReferenceCollections => Set<ReferenceCollection>();
    public DbSet<ReferenceCollectionTranslation> ReferenceCollectionTranslations =>
        Set<ReferenceCollectionTranslation>();
    public DbSet<ReferenceCollectionItem> ReferenceCollectionItems =>
        Set<ReferenceCollectionItem>();
    public DbSet<Resource> Resources => Set<Resource>();
    public DbSet<ResourceTranslation> ResourceTranslations => Set<ResourceTranslation>();
    public DbSet<ResourceLink> ResourceLinks => Set<ResourceLink>();
    public DbSet<ResourceIdentifier> ResourceIdentifiers => Set<ResourceIdentifier>();
    public DbSet<Resume> Resumes => Set<Resume>();
    public DbSet<ResumeTranslation> ResumeTranslations => Set<ResumeTranslation>();
    public DbSet<ResumeSkill> ResumeSkills => Set<ResumeSkill>();
    public DbSet<ResumeSkillTechnology> ResumeSkillTechnologies => Set<ResumeSkillTechnology>();
    public DbSet<ResumeLanguage> ResumeLanguages => Set<ResumeLanguage>();
    public DbSet<ResumeSelectedCase> ResumeSelectedCases => Set<ResumeSelectedCase>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<ProfileTranslation> ProfileTranslations => Set<ProfileTranslation>();
    public DbSet<SiteSettings> SiteSettings => Set<SiteSettings>();
    public DbSet<SiteSettingsTranslation> SiteSettingsTranslations =>
        Set<SiteSettingsTranslation>();
    public DbSet<ContactProfile> ContactProfiles => Set<ContactProfile>();
    public DbSet<NavItem> NavItems => Set<NavItem>();
    public DbSet<NavItemTranslation> NavItemTranslations => Set<NavItemTranslation>();
    public DbSet<Page> Pages => Set<Page>();
    public DbSet<PageTranslation> PageTranslations => Set<PageTranslation>();
    public DbSet<PageFeaturedCase> PageFeaturedCases => Set<PageFeaturedCase>();
    public DbSet<PageFeaturedProject> PageFeaturedProjects => Set<PageFeaturedProject>();
    public DbSet<PageFeaturedWriting> PageFeaturedWritings => Set<PageFeaturedWriting>();
    public DbSet<RelationType> RelationTypes => Set<RelationType>();
    public DbSet<ContentRelation> ContentRelations => Set<ContentRelation>();
    public DbSet<AuditLogEntry> AuditLog => Set<AuditLogEntry>();
    public DbSet<ContentRevision> ContentRevisions => Set<ContentRevision>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder) =>
        PortfolioModel.ConfigureConventions(configurationBuilder);

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        PortfolioModel.Configure(modelBuilder, Database);
        PublicVisibilityFilters.Apply(modelBuilder);
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess) =>
        throw new InvalidOperationException("The public context is read-only.");

    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default
    ) => throw new InvalidOperationException("The public context is read-only.");
}
