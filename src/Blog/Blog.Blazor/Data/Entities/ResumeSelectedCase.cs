namespace Blog.Blazor.Data.Entities;

public sealed class ResumeSelectedCase
{
    public int ResumeId { get; set; }
    public int CaseStudyId { get; set; }
    public int? Order { get; set; }

    public Resume? Resume { get; set; }
    public CaseStudy? CaseStudy { get; set; }
}
