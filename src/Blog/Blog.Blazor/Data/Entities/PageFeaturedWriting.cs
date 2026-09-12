namespace Blog.Blazor.Data.Entities;

public sealed class PageFeaturedWriting
{
    public int PageId { get; set; }
    public int WritingId { get; set; }
    public int? Order { get; set; }

    public Page? Page { get; set; }
    public Writing? Writing { get; set; }
}
