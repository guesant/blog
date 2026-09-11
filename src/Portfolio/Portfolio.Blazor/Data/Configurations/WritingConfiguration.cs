using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class WritingConfiguration : IEntityTypeConfiguration<Writing>
{
    public void Configure(EntityTypeBuilder<Writing> builder)
    {
        builder.ToTable("writings");
        builder.HasKey(writing => writing.Id);
        builder.Property(writing => writing.Id).HasColumnName("id");
        builder.Property(writing => writing.Slug).HasColumnName("slug").IsRequired();
        builder
            .Property(writing => writing.PublicId)
            .HasColumnName("public_id")
            .IsRequired()
            .HasMaxLength(6);
        builder
            .HasIndex(writing => writing.PublicId)
            .IsUnique()
            .HasDatabaseName("writings_public_id_unique");
        builder.Property(writing => writing.Hidden).HasColumnName("hidden").HasDefaultValue(false);
        builder.Property(writing => writing.DateIso).HasColumnName("date_iso");
        builder.Property(writing => writing.CreatedAt).HasColumnName("created_at");
        builder.Property(writing => writing.UpdatedAt).HasColumnName("updated_at");
        builder
            .Property(writing => writing.ShowHistory)
            .HasColumnName("show_history")
            .HasDefaultValue(false);
        builder.Property(writing => writing.Type).HasColumnName("type").IsRequired();
        builder
            .HasIndex(writing => writing.Slug)
            .IsUnique()
            .HasDatabaseName("writings_slug_unique");

        builder
            .HasMany(writing => writing.Translations)
            .WithOne(translation => translation.Writing)
            .HasForeignKey(translation => translation.WritingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
