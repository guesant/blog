using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ProfileConfiguration : IEntityTypeConfiguration<Profile>
{
    private static readonly ValueConverter<DateOnly?, string?> FlexibleDateOnlyConverter = new(
        date =>
            date.HasValue ? date.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) : null,
        text =>
            string.IsNullOrWhiteSpace(text)
                ? null
                : DateOnly.FromDateTime(DateTime.Parse(text, CultureInfo.InvariantCulture))
    );

    public void Configure(EntityTypeBuilder<Profile> builder)
    {
        builder.ToTable("profiles");
        builder.HasKey(profile => profile.Id);
        builder.Property(profile => profile.Id).HasColumnName("id");
        builder.Property(profile => profile.Name).HasColumnName("name");
        builder
            .Property(profile => profile.BirthDate)
            .HasColumnName("birth_date")
            .HasConversion(FlexibleDateOnlyConverter);
        builder.Property(profile => profile.CreatedAt).HasColumnName("created_at");
        builder.Property(profile => profile.UpdatedAt).HasColumnName("updated_at");

        builder
            .HasMany(profile => profile.Translations)
            .WithOne(translation => translation.Profile)
            .HasForeignKey(translation => translation.ProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
