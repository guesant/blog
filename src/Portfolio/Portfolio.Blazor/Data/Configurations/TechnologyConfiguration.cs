using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class TechnologyConfiguration : IEntityTypeConfiguration<Technology>
{
    public void Configure(EntityTypeBuilder<Technology> builder)
    {
        builder.ToTable("technologies");
        builder.HasKey(technology => technology.Id);
        builder.Property(technology => technology.Id).HasColumnName("id");
        builder.Property(technology => technology.Slug).HasColumnName("slug").IsRequired();
        builder
            .Property(technology => technology.PublicId)
            .HasColumnName("public_id")
            .IsRequired()
            .HasMaxLength(6);
        builder
            .HasIndex(technology => technology.PublicId)
            .IsUnique()
            .HasDatabaseName("technologies_public_id_unique");
        builder.Property(technology => technology.Order).HasColumnName("order");
        builder.Property(technology => technology.Code).HasColumnName("code");
        builder.Property(technology => technology.Logo).HasColumnName("logo");
        builder.Property(technology => technology.CreatedAt).HasColumnName("created_at");
        builder.Property(technology => technology.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(technology => technology.Slug)
            .IsUnique()
            .HasDatabaseName("technologies_slug_unique");

        builder
            .HasMany(technology => technology.Translations)
            .WithOne(translation => translation.Technology)
            .HasForeignKey(translation => translation.TechnologyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
