namespace Blog.Blazor.Stories.Stories.Forms;

public partial class SiteSelectWithCustom_stories
{
    private static readonly string[] Platforms =
    [
        "linkedin",
        "github",
        "gitlab",
        "lattes",
        "orcid",
    ];
    private string _known = "github";
    private string _custom = "mastodon";
}
