using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class SnippetConfiguration : IEntityTypeConfiguration<Snippet>
{
    public void Configure(EntityTypeBuilder<Snippet> builder)
    {
        builder.ToTable("snippets");
        builder.HasKey(snippet => snippet.Id);
        builder.Property(snippet => snippet.Id).HasColumnName("id");
        builder.Property(snippet => snippet.Slug).HasColumnName("slug").IsRequired();
        builder
            .Property(snippet => snippet.PublicId)
            .HasColumnName("public_id")
            .IsRequired()
            .HasMaxLength(6);
        builder
            .HasIndex(snippet => snippet.PublicId)
            .IsUnique()
            .HasDatabaseName("snippets_public_id_unique");
        builder.Property(snippet => snippet.Hidden).HasColumnName("hidden").HasDefaultValue(false);
        builder
            .Property(snippet => snippet.ShowHistory)
            .HasColumnName("show_history")
            .HasDefaultValue(false);
        builder.Property(snippet => snippet.Order).HasColumnName("order");
        builder.Property(snippet => snippet.CreatedAt).HasColumnName("created_at");
        builder.Property(snippet => snippet.UpdatedAt).HasColumnName("updated_at");
        builder.Property(snippet => snippet.PublishedAt).HasColumnName("published_at");
        builder
            .HasIndex(snippet => snippet.Slug)
            .IsUnique()
            .HasDatabaseName("snippets_slug_unique");

        builder
            .HasMany(snippet => snippet.Translations)
            .WithOne(translation => translation.Snippet)
            .HasForeignKey(translation => translation.SnippetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(snippet => snippet.Files)
            .WithOne(file => file.Snippet)
            .HasForeignKey(file => file.SnippetId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
