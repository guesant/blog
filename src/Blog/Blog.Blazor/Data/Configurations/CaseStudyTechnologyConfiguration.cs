using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class CaseStudyTechnologyConfiguration : IEntityTypeConfiguration<CaseStudyTechnology>
{
    public void Configure(EntityTypeBuilder<CaseStudyTechnology> builder)
    {
        builder.ToTable("case_study_technology");
        builder.HasKey(caseStudyTechnology => new
        {
            caseStudyTechnology.CaseStudyId,
            caseStudyTechnology.TechnologyId,
        });
        builder
            .Property(caseStudyTechnology => caseStudyTechnology.CaseStudyId)
            .HasColumnName("case_study_id");
        builder
            .Property(caseStudyTechnology => caseStudyTechnology.TechnologyId)
            .HasColumnName("technology_id");
        builder
            .Property(caseStudyTechnology => caseStudyTechnology.Order)
            .HasColumnName("order")
            .HasDefaultValue(0);

        builder
            .HasOne(caseStudyTechnology => caseStudyTechnology.Technology)
            .WithMany()
            .HasForeignKey(caseStudyTechnology => caseStudyTechnology.TechnologyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
