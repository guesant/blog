using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ContactProfileConfiguration : IEntityTypeConfiguration<ContactProfile>
{
    public void Configure(EntityTypeBuilder<ContactProfile> builder)
    {
        builder.ToTable("contact_profiles");
        builder.HasKey(contactProfile => contactProfile.Id);
        builder.Property(contactProfile => contactProfile.Id).HasColumnName("id");
        builder
            .Property(contactProfile => contactProfile.SiteSettingsId)
            .HasColumnName("site_settings_id");
        builder
            .Property(contactProfile => contactProfile.Platform)
            .HasColumnName("platform")
            .IsRequired();
        builder.Property(contactProfile => contactProfile.Label).HasColumnName("label");
        builder.Property(contactProfile => contactProfile.Url).HasColumnName("url").IsRequired();
        builder.Property(contactProfile => contactProfile.Order).HasColumnName("order");
        builder.Property(contactProfile => contactProfile.CreatedAt).HasColumnName("created_at");
        builder.Property(contactProfile => contactProfile.UpdatedAt).HasColumnName("updated_at");
    }
}
