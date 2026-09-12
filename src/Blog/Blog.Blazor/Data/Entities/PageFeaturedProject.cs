namespace Blog.Blazor.Data.Entities;

public sealed class PageFeaturedProject
{
    public int PageId { get; set; }
    public int ProjectId { get; set; }
    public int? Order { get; set; }

    public Page? Page { get; set; }
    public Project? Project { get; set; }
}
