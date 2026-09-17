namespace Blog.Blazor.Data.Entities;

public sealed class Profile
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public DateOnly? BirthDate { get; set; }
    public bool Hidden { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<ProfileTranslation> Translations { get; set; } = [];
}
