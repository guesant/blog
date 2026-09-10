using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ResourceTranslationConfiguration : IEntityTypeConfiguration<ResourceTranslation>
{
    public void Configure(EntityTypeBuilder<ResourceTranslation> builder)
    {
        builder.ToTable("resource_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.ResourceId).HasColumnName("resource_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Title).HasColumnName("title").IsRequired();
        builder
            .Property(translation => translation.AlternativeTitle)
            .HasColumnName("alternative_title");
        builder.Property(translation => translation.Description).HasColumnName("description");
        builder.Property(translation => translation.PersonalNote).HasColumnName("personal_note");
        builder.Property(translation => translation.ReasonFound).HasColumnName("reason_found");
        builder.Property(translation => translation.Seo).HasColumnName("seo");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.ResourceId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("resource_translations_resource_id_locale_unique");
    }
}
