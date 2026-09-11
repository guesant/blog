using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ExperimentConfiguration : IEntityTypeConfiguration<Experiment>
{
    public void Configure(EntityTypeBuilder<Experiment> builder)
    {
        builder.ToTable("experiments");
        builder.HasKey(experiment => experiment.Id);
        builder.Property(experiment => experiment.Id).HasColumnName("id");
        builder.Property(experiment => experiment.Slug).HasColumnName("slug").IsRequired();
        builder
            .Property(experiment => experiment.PublicId)
            .HasColumnName("public_id")
            .IsRequired()
            .HasMaxLength(6);
        builder
            .HasIndex(experiment => experiment.PublicId)
            .IsUnique()
            .HasDatabaseName("experiments_public_id_unique");
        builder
            .Property(experiment => experiment.Hidden)
            .HasColumnName("hidden")
            .HasDefaultValue(false);
        builder.Property(experiment => experiment.Order).HasColumnName("order");
        builder.Property(experiment => experiment.Href).HasColumnName("href");
        builder
            .Property(experiment => experiment.External)
            .HasColumnName("external")
            .HasDefaultValue(false);
        builder.Property(experiment => experiment.CreatedAt).HasColumnName("created_at");
        builder.Property(experiment => experiment.UpdatedAt).HasColumnName("updated_at");
        builder.Property(experiment => experiment.PublishedAt).HasColumnName("published_at");
        builder
            .Property(experiment => experiment.ShowHistory)
            .HasColumnName("show_history")
            .HasDefaultValue(false);
        builder
            .HasIndex(experiment => experiment.Slug)
            .IsUnique()
            .HasDatabaseName("experiments_slug_unique");

        builder
            .HasMany(experiment => experiment.Translations)
            .WithOne(translation => translation.Experiment)
            .HasForeignKey(translation => translation.ExperimentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(experiment => experiment.ExperimentTechnologies)
            .WithOne(experimentTechnology => experimentTechnology.Experiment)
            .HasForeignKey(experimentTechnology => experimentTechnology.ExperimentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
