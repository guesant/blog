using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ResourceConfiguration : IEntityTypeConfiguration<Resource>
{
    public void Configure(EntityTypeBuilder<Resource> builder)
    {
        builder.ToTable("resources");
        builder.HasKey(resource => resource.Id);
        builder.Property(resource => resource.Id).HasColumnName("id");
        builder.Property(resource => resource.Slug).HasColumnName("slug").IsRequired();
        builder
            .Property(resource => resource.PublicId)
            .HasColumnName("public_id")
            .IsRequired()
            .HasMaxLength(6);
        builder
            .HasIndex(resource => resource.PublicId)
            .IsUnique()
            .HasDatabaseName("resources_public_id_unique");
        builder
            .Property(resource => resource.Hidden)
            .HasColumnName("hidden")
            .HasDefaultValue(false);
        builder.Property(resource => resource.Order).HasColumnName("order");
        builder.Property(resource => resource.Type).HasColumnName("type").IsRequired();
        builder.Property(resource => resource.LanguageId).HasColumnName("language_id");
        builder.Property(resource => resource.Authors).HasColumnName("authors");
        builder.Property(resource => resource.Organizations).HasColumnName("organizations");
        builder.Property(resource => resource.PublishedDateIso).HasColumnName("published_date_iso");
        builder.Property(resource => resource.FoundDateIso).HasColumnName("found_date_iso");
        builder.Property(resource => resource.ConsumptionState).HasColumnName("consumption_state");
        builder.Property(resource => resource.Rating).HasColumnName("rating");
        builder.Property(resource => resource.EditorialState).HasColumnName("editorial_state");
        builder.Property(resource => resource.Visibility).HasColumnName("visibility");
        builder.Property(resource => resource.TypeDetails).HasColumnName("type_details");
        builder.Property(resource => resource.CreatedAt).HasColumnName("created_at");
        builder.Property(resource => resource.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(resource => resource.Slug)
            .IsUnique()
            .HasDatabaseName("resources_slug_unique");

        builder
            .HasOne(resource => resource.Language)
            .WithMany()
            .HasForeignKey(resource => resource.LanguageId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(resource => resource.Translations)
            .WithOne(translation => translation.Resource)
            .HasForeignKey(translation => translation.ResourceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(resource => resource.Links)
            .WithOne(link => link.Resource)
            .HasForeignKey(link => link.ResourceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(resource => resource.Identifiers)
            .WithOne(identifier => identifier.Resource)
            .HasForeignKey(identifier => identifier.ResourceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
