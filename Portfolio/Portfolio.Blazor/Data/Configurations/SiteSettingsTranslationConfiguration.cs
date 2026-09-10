using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class SiteSettingsTranslationConfiguration
    : IEntityTypeConfiguration<SiteSettingsTranslation>
{
    public void Configure(EntityTypeBuilder<SiteSettingsTranslation> builder)
    {
        builder.ToTable("site_settings_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder
            .Property(translation => translation.SiteSettingsId)
            .HasColumnName("site_settings_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder
            .Property(translation => translation.CopyrightTemplate)
            .HasColumnName("copyright_template");
        builder
            .Property(translation => translation.MaintenanceEyebrow)
            .HasColumnName("maintenance_eyebrow");
        builder
            .Property(translation => translation.MaintenanceTitle)
            .HasColumnName("maintenance_title");
        builder
            .Property(translation => translation.MaintenanceDescription)
            .HasColumnName("maintenance_description");
        builder.Property(translation => translation.Seo).HasColumnName("seo");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.SiteSettingsId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("site_settings_translations_site_settings_id_locale_unique");
    }
}
