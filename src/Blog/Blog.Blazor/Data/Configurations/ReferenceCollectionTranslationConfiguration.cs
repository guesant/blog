using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ReferenceCollectionTranslationConfiguration
    : IEntityTypeConfiguration<ReferenceCollectionTranslation>
{
    public void Configure(EntityTypeBuilder<ReferenceCollectionTranslation> builder)
    {
        builder.ToTable("reference_collection_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder
            .Property(translation => translation.ReferenceCollectionId)
            .HasColumnName("reference_collection_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Title).HasColumnName("title").IsRequired();
        builder.Property(translation => translation.Description).HasColumnName("description");
        builder.Property(translation => translation.Intro).HasColumnName("intro");
        builder.Property(translation => translation.Seo).HasColumnName("seo");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.ReferenceCollectionId, translation.Locale })
            .IsUnique()
            .HasDatabaseName(
                "reference_collection_translations_reference_collection_id_locale_unique"
            );
    }
}
