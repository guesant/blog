using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class CaseStudyTranslationConfiguration
    : IEntityTypeConfiguration<CaseStudyTranslation>
{
    public void Configure(EntityTypeBuilder<CaseStudyTranslation> builder)
    {
        builder.ToTable("case_study_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.CaseStudyId).HasColumnName("case_study_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Title).HasColumnName("title").IsRequired();
        builder.Property(translation => translation.Status).HasColumnName("status");
        builder.Property(translation => translation.Meta).HasColumnName("meta");
        builder.Property(translation => translation.Summary).HasColumnName("summary");
        builder.Property(translation => translation.Context).HasColumnName("context");
        builder.Property(translation => translation.Role).HasColumnName("role");
        builder.Property(translation => translation.Result).HasColumnName("result");
        builder.Property(translation => translation.Metrics).HasColumnName("metrics");
        builder.Property(translation => translation.Body).HasColumnName("body");
        builder.Property(translation => translation.Seo).HasColumnName("seo");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.CaseStudyId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("case_study_translations_case_study_id_locale_unique");
    }
}
