using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class SnippetTranslationConfiguration : IEntityTypeConfiguration<SnippetTranslation>
{
    public void Configure(EntityTypeBuilder<SnippetTranslation> builder)
    {
        builder.ToTable("snippet_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.SnippetId).HasColumnName("snippet_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Title).HasColumnName("title").IsRequired();
        builder.Property(translation => translation.Description).HasColumnName("description");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.SnippetId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("snippet_translations_snippet_id_locale_unique");
    }
}
