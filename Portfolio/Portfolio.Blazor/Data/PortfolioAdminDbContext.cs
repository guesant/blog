using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Portfolio.Blazor.Data.Configurations;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data;

public sealed class PortfolioAdminDbContext(DbContextOptions<PortfolioAdminDbContext> options)
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
    public DbSet<ContentRevision> ContentRevisions => Set<ContentRevision>();

    // IMPORTANT: this database was created by Laravel and indexes only what it
    // declares. EF's convention of indexing every foreign key would add 22 indexes
    // that do not exist in production, so the schema the migrations describe would
    // stop matching the live file. Indexes are declared explicitly instead.
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Conventions.Remove<ForeignKeyIndexConvention>();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new ProjectConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectTechnologyConfiguration());
        modelBuilder.ApplyConfiguration(new CaseStudyConfiguration());
        modelBuilder.ApplyConfiguration(new CaseStudyTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new CaseStudyTechnologyConfiguration());
        modelBuilder.ApplyConfiguration(new TechnologyConfiguration());
        modelBuilder.ApplyConfiguration(new TechnologyTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new ExperimentConfiguration());
        modelBuilder.ApplyConfiguration(new ExperimentTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new ExperimentTechnologyConfiguration());
        modelBuilder.ApplyConfiguration(new CreditEntryConfiguration());
        modelBuilder.ApplyConfiguration(new CreditEntryTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new TopicConfiguration());
        modelBuilder.ApplyConfiguration(new TopicTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new LanguageConfiguration());
        modelBuilder.ApplyConfiguration(new LanguageTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new WritingConfiguration());
        modelBuilder.ApplyConfiguration(new WritingTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new SnippetConfiguration());
        modelBuilder.ApplyConfiguration(new SnippetTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new SnippetFileConfiguration());
        modelBuilder.ApplyConfiguration(new TopicableConfiguration());
        modelBuilder.ApplyConfiguration(new ReferenceCollectionConfiguration());
        modelBuilder.ApplyConfiguration(new ReferenceCollectionTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new ReferenceCollectionItemConfiguration());
        modelBuilder.ApplyConfiguration(new ResourceConfiguration());
        modelBuilder.ApplyConfiguration(new ResourceTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new ResourceLinkConfiguration());
        modelBuilder.ApplyConfiguration(new ResourceIdentifierConfiguration());
        modelBuilder.ApplyConfiguration(new ResumeConfiguration());
        modelBuilder.ApplyConfiguration(new ResumeTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new ResumeSkillConfiguration());
        modelBuilder.ApplyConfiguration(new ResumeSkillTechnologyConfiguration());
        modelBuilder.ApplyConfiguration(new ResumeLanguageConfiguration());
        modelBuilder.ApplyConfiguration(new ResumeSelectedCaseConfiguration());
        modelBuilder.ApplyConfiguration(new ProfileConfiguration());
        modelBuilder.ApplyConfiguration(new ProfileTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new SiteSettingsConfiguration());
        modelBuilder.ApplyConfiguration(new SiteSettingsTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new ContactProfileConfiguration());
        modelBuilder.ApplyConfiguration(new NavItemConfiguration());
        modelBuilder.ApplyConfiguration(new NavItemTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new PageConfiguration());
        modelBuilder.ApplyConfiguration(new PageTranslationConfiguration());
        modelBuilder.ApplyConfiguration(new PageFeaturedCaseConfiguration());
        modelBuilder.ApplyConfiguration(new PageFeaturedProjectConfiguration());
        modelBuilder.ApplyConfiguration(new PageFeaturedWritingConfiguration());
        modelBuilder.ApplyConfiguration(new RelationTypeConfiguration());
        modelBuilder.ApplyConfiguration(new ContentRelationConfiguration());
        modelBuilder.ApplyConfiguration(new AuditLogEntryConfiguration());
        modelBuilder.ApplyConfiguration(new AuditRequestConfiguration());
        modelBuilder.ApplyConfiguration(new ContentRevisionConfiguration());
        ApplyProviderMappings(modelBuilder);
    }

    // IMPORTANT: the SQLite schema stores dates as TEXT (Laravel legacy), so DateOnly columns go
    // through a lenient string converter and DateTime stays as text; PostgreSQL gets native date
    // columns and, because the legacy values are wall-clock timestamps with no zone, "timestamp
    // without time zone" instead of Npgsql's default timestamptz (which rejects Unspecified kinds).
    private void ApplyProviderMappings(ModelBuilder modelBuilder)
    {
        if (!Database.IsNpgsql())
        {
            return;
        }

        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entity.GetProperties())
            {
                if (property.ClrType == typeof(DateOnly) || property.ClrType == typeof(DateOnly?))
                {
                    property.SetValueConverter((ValueConverter?)null);
                    property.SetColumnType("date");
                }
                else if (
                    property.ClrType == typeof(DateTime)
                    || property.ClrType == typeof(DateTime?)
                )
                {
                    property.SetColumnType("timestamp without time zone");
                }
            }
        }
    }
}
