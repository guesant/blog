using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ReferenceCollectionConfiguration : IEntityTypeConfiguration<ReferenceCollection>
{
    public void Configure(EntityTypeBuilder<ReferenceCollection> builder)
    {
        builder.ToTable("reference_collections");
        builder.HasKey(collection => collection.Id);
        builder.Property(collection => collection.Id).HasColumnName("id");
        builder.Property(collection => collection.Slug).HasColumnName("slug").IsRequired();
        builder
            .Property(collection => collection.PublicId)
            .HasColumnName("public_id")
            .IsRequired()
            .HasMaxLength(6);
        builder
            .HasIndex(collection => collection.PublicId)
            .IsUnique()
            .HasDatabaseName("reference_collections_public_id_unique");
        builder
            .Property(collection => collection.Hidden)
            .HasColumnName("hidden")
            .HasDefaultValue(false);
        builder.Property(collection => collection.Order).HasColumnName("order");
        builder.Property(collection => collection.Image).HasColumnName("image");
        builder.Property(collection => collection.CreatedAt).HasColumnName("created_at");
        builder.Property(collection => collection.UpdatedAt).HasColumnName("updated_at");
        builder.Property(collection => collection.PublishedAt).HasColumnName("published_at");
        builder
            .HasIndex(collection => collection.Slug)
            .IsUnique()
            .HasDatabaseName("reference_collections_slug_unique");

        builder
            .HasMany(collection => collection.Translations)
            .WithOne(translation => translation.ReferenceCollection)
            .HasForeignKey(translation => translation.ReferenceCollectionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(collection => collection.Items)
            .WithOne(item => item.ReferenceCollection)
            .HasForeignKey(item => item.ReferenceCollectionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
