using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ExperimentTechnologyConfiguration
    : IEntityTypeConfiguration<ExperimentTechnology>
{
    public void Configure(EntityTypeBuilder<ExperimentTechnology> builder)
    {
        builder.ToTable("experiment_technology");
        builder.HasKey(experimentTechnology => new
        {
            experimentTechnology.ExperimentId,
            experimentTechnology.TechnologyId,
        });
        builder
            .Property(experimentTechnology => experimentTechnology.ExperimentId)
            .HasColumnName("experiment_id");
        builder
            .Property(experimentTechnology => experimentTechnology.TechnologyId)
            .HasColumnName("technology_id");
        builder
            .Property(experimentTechnology => experimentTechnology.Order)
            .HasColumnName("order")
            .HasDefaultValue(0);

        builder
            .HasOne(experimentTechnology => experimentTechnology.Technology)
            .WithMany()
            .HasForeignKey(experimentTechnology => experimentTechnology.TechnologyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
