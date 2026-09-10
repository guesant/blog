using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ResumeSelectedCaseConfiguration : IEntityTypeConfiguration<ResumeSelectedCase>
{
    public void Configure(EntityTypeBuilder<ResumeSelectedCase> builder)
    {
        builder.ToTable("resume_selected_case");
        builder.HasKey(selected => new { selected.ResumeId, selected.CaseStudyId });
        builder.Property(selected => selected.ResumeId).HasColumnName("resume_id");
        builder.Property(selected => selected.CaseStudyId).HasColumnName("case_study_id");
        builder.Property(selected => selected.Order).HasColumnName("order");

        builder
            .HasOne(selected => selected.CaseStudy)
            .WithMany()
            .HasForeignKey(selected => selected.CaseStudyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
