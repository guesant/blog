namespace Blog.Blazor.Data.Entities;

public sealed class ProjectTechnology
{
    public int ProjectId { get; set; }
    public int TechnologyId { get; set; }
    public int Order { get; set; }

    public Project? Project { get; set; }
    public Technology? Technology { get; set; }
}
