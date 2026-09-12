namespace Blog.Blazor.Data.Entities;

public sealed class CaseStudyTechnology
{
    public int CaseStudyId { get; set; }
    public int TechnologyId { get; set; }
    public int Order { get; set; }

    public CaseStudy? CaseStudy { get; set; }
    public Technology? Technology { get; set; }
}
