using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ProfileConfiguration : IEntityTypeConfiguration<Profile>
{
    public void Configure(EntityTypeBuilder<Profile> builder)
    {
        builder.ToTable("profiles");
        builder.HasKey(profile => profile.Id);
        builder.Property(profile => profile.Id).HasColumnName("id");
        builder.Property(profile => profile.Name).HasColumnName("name");
        builder.Property(profile => profile.BirthDate).HasColumnName("birth_date");
        builder.Property(profile => profile.CreatedAt).HasColumnName("created_at");
        builder.Property(profile => profile.UpdatedAt).HasColumnName("updated_at");

        builder
            .HasMany(profile => profile.Translations)
            .WithOne(translation => translation.Profile)
            .HasForeignKey(translation => translation.ProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
