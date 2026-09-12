using Blog.Blazor.Data;

namespace Blog.Blazor.Data.Entities;

public sealed class ProfileTranslation
{
    public int Id { get; set; }
    public int ProfileId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Location { get; set; }
    public string? BirthCity { get; set; }
    public string? Description { get; set; }
    public string? Interests { get; set; }
    public string? Learning { get; set; }

    [JsonOrEmpty]
    public string? PersonalInterests { get; set; }

    [JsonOrEmpty]
    public string? Trajectory { get; set; }

    [JsonOrEmpty]
    public string? Milestones { get; set; }

    [JsonOrEmpty]
    public string? Fortunes { get; set; }

    [JsonOrEmpty]
    public string? PersonalFacts { get; set; }

    [JsonOrEmpty]
    public string? PersonalThings { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Profile? Profile { get; set; }
}
