namespace Portfolio.Blazor.Data.Entities;

public sealed class ResumeSkillTechnology
{
    public int ResumeSkillId { get; set; }
    public int TechnologyId { get; set; }

    public ResumeSkill? ResumeSkill { get; set; }
    public Technology? Technology { get; set; }
}
