using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ProfileTranslationConfiguration : IEntityTypeConfiguration<ProfileTranslation>
{
    public void Configure(EntityTypeBuilder<ProfileTranslation> builder)
    {
        builder.ToTable("profile_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.ProfileId).HasColumnName("profile_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Title).HasColumnName("title");
        builder.Property(translation => translation.Location).HasColumnName("location");
        builder.Property(translation => translation.BirthCity).HasColumnName("birth_city");
        builder.Property(translation => translation.Description).HasColumnName("description");
        builder.Property(translation => translation.Interests).HasColumnName("interests");
        builder.Property(translation => translation.Learning).HasColumnName("learning");
        builder
            .Property(translation => translation.PersonalInterests)
            .HasColumnName("personal_interests");
        builder.Property(translation => translation.Trajectory).HasColumnName("trajectory");
        builder.Property(translation => translation.Milestones).HasColumnName("milestones");
        builder.Property(translation => translation.Fortunes).HasColumnName("fortunes");
        builder.Property(translation => translation.PersonalFacts).HasColumnName("personal_facts");
        builder
            .Property(translation => translation.PersonalThings)
            .HasColumnName("personal_things");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.ProfileId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("profile_translations_profile_id_locale_unique");
    }
}
