using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ExperimentTranslationConfiguration
    : IEntityTypeConfiguration<ExperimentTranslation>
{
    public void Configure(EntityTypeBuilder<ExperimentTranslation> builder)
    {
        builder.ToTable("experiment_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.ExperimentId).HasColumnName("experiment_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Name).HasColumnName("name").IsRequired();
        builder.Property(translation => translation.Purpose).HasColumnName("purpose").IsRequired();
        builder.Property(translation => translation.Body).HasColumnName("body");
        builder.Property(translation => translation.Seo).HasColumnName("seo");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.ExperimentId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("experiment_translations_experiment_id_locale_unique");
    }
}
