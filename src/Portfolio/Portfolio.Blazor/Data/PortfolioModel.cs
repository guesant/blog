using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Portfolio.Blazor.Data.Configurations;

namespace Portfolio.Blazor.Data;

internal static class PortfolioModel
{
    // IMPORTANT: this database was created by Laravel and indexes only what it
    // declares. EF's convention of indexing every foreign key would add 22 indexes
    // that do not exist in production, so the schema the migrations describe would
    // stop matching the live file. Indexes are declared explicitly instead.
    internal static void ConfigureConventions(ModelConfigurationBuilder configurationBuilder) =>
        configurationBuilder.Conventions.Remove<ForeignKeyIndexConvention>();

    internal static void Configure(ModelBuilder modelBuilder)
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
        ApplyColumnTypes(modelBuilder);
    }

    // IMPORTANT: the legacy Laravel data this schema was imported from stores dates as wall-clock
    // values with no time zone, so DateTime columns are "timestamp without time zone" instead of
    // Npgsql's default timestamptz, which rejects Unspecified DateTimeKind values.
    private static void ApplyColumnTypes(ModelBuilder modelBuilder)
    {
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entity.GetProperties())
            {
                if (property.ClrType == typeof(DateOnly) || property.ClrType == typeof(DateOnly?))
                {
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
