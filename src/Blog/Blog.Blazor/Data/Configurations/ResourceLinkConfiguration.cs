using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ResourceLinkConfiguration : IEntityTypeConfiguration<ResourceLink>
{
    public void Configure(EntityTypeBuilder<ResourceLink> builder)
    {
        builder.ToTable("resource_links");
        builder.HasKey(link => link.Id);
        builder.Property(link => link.Id).HasColumnName("id");
        builder.Property(link => link.ResourceId).HasColumnName("resource_id");
        builder.Property(link => link.Url).HasColumnName("url").IsRequired();
        builder.Property(link => link.Label).HasColumnName("label");
        builder.Property(link => link.Platform).HasColumnName("platform");
        builder.Property(link => link.Purpose).HasColumnName("purpose");
        builder.Property(link => link.IsPrimary).HasColumnName("is_primary").HasDefaultValue(false);
        builder.Property(link => link.IsFree).HasColumnName("is_free").HasDefaultValue(false);
        builder.Property(link => link.LanguageId).HasColumnName("language_id");
        builder.Property(link => link.CreatedAt).HasColumnName("created_at");
        builder.Property(link => link.UpdatedAt).HasColumnName("updated_at");

        builder
            .HasOne(link => link.Language)
            .WithMany()
            .HasForeignKey(link => link.LanguageId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
