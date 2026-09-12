using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class NavItemTranslationConfiguration : IEntityTypeConfiguration<NavItemTranslation>
{
    public void Configure(EntityTypeBuilder<NavItemTranslation> builder)
    {
        builder.ToTable("nav_item_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.NavItemId).HasColumnName("nav_item_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Label).HasColumnName("label").IsRequired();
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.NavItemId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("nav_item_translations_nav_item_id_locale_unique");
    }
}
