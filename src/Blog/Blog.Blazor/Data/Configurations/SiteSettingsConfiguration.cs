using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class SiteSettingsConfiguration : IEntityTypeConfiguration<SiteSettings>
{
    public void Configure(EntityTypeBuilder<SiteSettings> builder)
    {
        builder.ToTable("site_settings");
        builder.HasKey(siteSettings => siteSettings.Id);
        builder.Property(siteSettings => siteSettings.Id).HasColumnName("id");
        builder.Property(siteSettings => siteSettings.ShortName).HasColumnName("short_name");
        builder.Property(siteSettings => siteSettings.PortfolioUrl).HasColumnName("portfolio_url");
        builder
            .Property(siteSettings => siteSettings.MaintenanceEnabled)
            .HasColumnName("maintenance_enabled")
            .HasDefaultValue(false);
        builder.Property(siteSettings => siteSettings.ContactEmail).HasColumnName("contact_email");
        builder
            .Property(siteSettings => siteSettings.ContactAvailable)
            .HasColumnName("contact_available")
            .HasDefaultValue(false);
        builder
            .Property(siteSettings => siteSettings.SourceRepositoryUrl)
            .HasColumnName("source_repository_url");
        builder.Property(siteSettings => siteSettings.CreatedAt).HasColumnName("created_at");
        builder.Property(siteSettings => siteSettings.UpdatedAt).HasColumnName("updated_at");

        builder
            .HasMany(siteSettings => siteSettings.Translations)
            .WithOne(translation => translation.SiteSettings)
            .HasForeignKey(translation => translation.SiteSettingsId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(siteSettings => siteSettings.ContactProfiles)
            .WithOne(contactProfile => contactProfile.SiteSettings)
            .HasForeignKey(contactProfile => contactProfile.SiteSettingsId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
