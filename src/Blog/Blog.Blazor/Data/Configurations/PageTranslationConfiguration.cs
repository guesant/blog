using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class PageTranslationConfiguration : IEntityTypeConfiguration<PageTranslation>
{
    public void Configure(EntityTypeBuilder<PageTranslation> builder)
    {
        builder.ToTable("page_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.PageId).HasColumnName("page_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Fields).HasColumnName("fields").IsRequired();
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.PageId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("page_translations_page_id_locale_unique");
    }
}
