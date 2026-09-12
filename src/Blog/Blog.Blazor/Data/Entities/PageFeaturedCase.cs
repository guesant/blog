namespace Blog.Blazor.Data.Entities;

public sealed class PageFeaturedCase
{
    public int PageId { get; set; }
    public int CaseStudyId { get; set; }
    public int? Order { get; set; }

    public Page? Page { get; set; }
    public CaseStudy? CaseStudy { get; set; }
}
