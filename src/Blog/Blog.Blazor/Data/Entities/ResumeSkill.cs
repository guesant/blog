namespace Blog.Blazor.Data.Entities;

public sealed class ResumeSkill
{
    public int Id { get; set; }
    public int ResumeId { get; set; }
    public int? Order { get; set; }
    public int TopicId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Resume? Resume { get; set; }
    public Topic? Topic { get; set; }
    public List<ResumeSkillTechnology> SkillTechnologies { get; set; } = [];
}
