using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ResumeTranslationConfiguration : IEntityTypeConfiguration<ResumeTranslation>
{
    public void Configure(EntityTypeBuilder<ResumeTranslation> builder)
    {
        builder.ToTable("resume_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.ResumeId).HasColumnName("resume_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Summary).HasColumnName("summary");
        builder.Property(translation => translation.Leadership).HasColumnName("leadership");
        builder.Property(translation => translation.Education).HasColumnName("education");
        builder.Property(translation => translation.Certificates).HasColumnName("certificates");
        builder.Property(translation => translation.Certifications).HasColumnName("certifications");
        builder.Property(translation => translation.Publications).HasColumnName("publications");
        builder
            .Property(translation => translation.Recommendations)
            .HasColumnName("recommendations");
        builder
            .Property(translation => translation.TechnicalProductions)
            .HasColumnName("technical_productions");
        builder.Property(translation => translation.Events).HasColumnName("events");
        builder.Property(translation => translation.Awards).HasColumnName("awards");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.ResumeId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("resume_translations_resume_id_locale_unique");
    }
}
