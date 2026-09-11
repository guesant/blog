using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class CreditEntryConfiguration : IEntityTypeConfiguration<CreditEntry>
{
    public void Configure(EntityTypeBuilder<CreditEntry> builder)
    {
        builder.ToTable("credit_entries");
        builder.HasKey(creditEntry => creditEntry.Id);
        builder.Property(creditEntry => creditEntry.Id).HasColumnName("id");
        builder.Property(creditEntry => creditEntry.Url).HasColumnName("url");
        builder
            .Property(creditEntry => creditEntry.Category)
            .HasColumnName("category")
            .IsRequired();
        builder.Property(creditEntry => creditEntry.Order).HasColumnName("order");
        builder.Property(creditEntry => creditEntry.CreatedAt).HasColumnName("created_at");
        builder.Property(creditEntry => creditEntry.UpdatedAt).HasColumnName("updated_at");
        builder
            .Property(creditEntry => creditEntry.IsAutomatic)
            .HasColumnName("is_automatic")
            .HasDefaultValue(false);
        builder
            .Property(creditEntry => creditEntry.Active)
            .HasColumnName("active")
            .HasDefaultValue(true);
        builder
            .Property(creditEntry => creditEntry.PackageManager)
            .HasColumnName("package_manager");
        builder.Property(creditEntry => creditEntry.PackageName).HasColumnName("package_name");

        builder
            .HasMany(creditEntry => creditEntry.Translations)
            .WithOne(translation => translation.CreditEntry)
            .HasForeignKey(translation => translation.CreditEntryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
