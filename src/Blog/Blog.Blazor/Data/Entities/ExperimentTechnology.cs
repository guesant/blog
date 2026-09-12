namespace Blog.Blazor.Data.Entities;

public sealed class ExperimentTechnology
{
    public int ExperimentId { get; set; }
    public int TechnologyId { get; set; }
    public int Order { get; set; }

    public Experiment? Experiment { get; set; }
    public Technology? Technology { get; set; }
}
