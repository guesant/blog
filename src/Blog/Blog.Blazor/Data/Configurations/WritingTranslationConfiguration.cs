using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class WritingTranslationConfiguration : IEntityTypeConfiguration<WritingTranslation>
{
    public void Configure(EntityTypeBuilder<WritingTranslation> builder)
    {
        builder.ToTable("writing_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.WritingId).HasColumnName("writing_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Title).HasColumnName("title").IsRequired();
        builder.Property(translation => translation.Excerpt).HasColumnName("excerpt");
        builder.Property(translation => translation.ReadingTime).HasColumnName("reading_time");
        builder.Property(translation => translation.Body).HasColumnName("body");
        builder.Property(translation => translation.Seo).HasColumnName("seo");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.WritingId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("writing_translations_writing_id_locale_unique");
    }
}
