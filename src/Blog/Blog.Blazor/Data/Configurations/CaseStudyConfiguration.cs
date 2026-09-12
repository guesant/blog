using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class CaseStudyConfiguration : IEntityTypeConfiguration<CaseStudy>
{
    public void Configure(EntityTypeBuilder<CaseStudy> builder)
    {
        builder.ToTable("case_studies");
        builder.HasKey(caseStudy => caseStudy.Id);
        builder.Property(caseStudy => caseStudy.Id).HasColumnName("id");
        builder.Property(caseStudy => caseStudy.Slug).HasColumnName("slug").IsRequired();
        builder
            .Property(caseStudy => caseStudy.PublicId)
            .HasColumnName("public_id")
            .IsRequired()
            .HasMaxLength(6);
        builder
            .HasIndex(caseStudy => caseStudy.PublicId)
            .IsUnique()
            .HasDatabaseName("case_studies_public_id_unique");
        builder
            .Property(caseStudy => caseStudy.Hidden)
            .HasColumnName("hidden")
            .HasDefaultValue(false);
        builder.Property(caseStudy => caseStudy.Order).HasColumnName("order");
        builder.Property(caseStudy => caseStudy.Href).HasColumnName("href");
        builder
            .Property(caseStudy => caseStudy.External)
            .HasColumnName("external")
            .HasDefaultValue(false);
        builder.Property(caseStudy => caseStudy.Visual).HasColumnName("visual");
        builder.Property(caseStudy => caseStudy.CreatedAt).HasColumnName("created_at");
        builder.Property(caseStudy => caseStudy.UpdatedAt).HasColumnName("updated_at");
        builder.Property(caseStudy => caseStudy.Nda).HasColumnName("nda").HasDefaultValue(false);
        builder.Property(caseStudy => caseStudy.PublishedAt).HasColumnName("published_at");
        builder
            .Property(caseStudy => caseStudy.ShowHistory)
            .HasColumnName("show_history")
            .HasDefaultValue(false);
        builder
            .HasIndex(caseStudy => caseStudy.Slug)
            .IsUnique()
            .HasDatabaseName("case_studies_slug_unique");

        builder
            .HasMany(caseStudy => caseStudy.Translations)
            .WithOne(translation => translation.CaseStudy)
            .HasForeignKey(translation => translation.CaseStudyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(caseStudy => caseStudy.CaseStudyTechnologies)
            .WithOne(caseStudyTechnology => caseStudyTechnology.CaseStudy)
            .HasForeignKey(caseStudyTechnology => caseStudyTechnology.CaseStudyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
