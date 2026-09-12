namespace Blog.Blazor.Stories.Stories.Forms;

public partial class SiteJsonArrayInput_stories
{
    private static readonly string[] TrajectoryFields =
    [
        "role",
        "organization",
        "period",
        "highlights:list",
        "includeInResume:bool",
        "hidden:bool",
    ];

    private string? _trajectory =
        """[{"role":"software developer","organization":"private company","period":"2025-2026","highlights":["maintenance","backend changes"],"includeInResume":true,"hidden":false}]""";
}
