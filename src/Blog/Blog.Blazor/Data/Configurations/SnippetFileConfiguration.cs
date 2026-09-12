using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class SnippetFileConfiguration : IEntityTypeConfiguration<SnippetFile>
{
    public void Configure(EntityTypeBuilder<SnippetFile> builder)
    {
        builder.ToTable("snippet_files");
        builder.HasKey(file => file.Id);
        builder.Property(file => file.Id).HasColumnName("id");
        builder.Property(file => file.SnippetId).HasColumnName("snippet_id");
        builder.Property(file => file.Path).HasColumnName("path").IsRequired();
        builder.Property(file => file.Language).HasColumnName("language");
        builder.Property(file => file.Content).HasColumnName("content").IsRequired();
        builder.Property(file => file.Order).HasColumnName("order").HasDefaultValue(0);
        builder.Property(file => file.CreatedAt).HasColumnName("created_at");
        builder.Property(file => file.UpdatedAt).HasColumnName("updated_at");
    }
}
