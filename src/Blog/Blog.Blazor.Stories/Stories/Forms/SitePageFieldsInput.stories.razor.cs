using Blog.Blazor.Core;

namespace Blog.Blazor.Stories.Stories.Forms;

public partial class SitePageFieldsInput_stories
{
    private string? _homeValue =
        "{\"heroIdentity\":\"software developer\",\"heroExperience\":\"building things.\",\"availableLabel\":\"available\"}";
    private string? _homeEmitted;

    private string? _aboutValue =
        "{\"eyebrow\":\"sobre mim\",\"title\":\"a curiosidade veio antes da carreira.\",\"story\":\"minha relação com tecnologia começou cedo.\"}";
    private string? _aboutEmitted;

    private string? _unmappedValue = "{\"eyebrow\":\"now\",\"title\":\"what I'm doing now\"}";

    private PageFieldSlug _switchSlug = PageFieldSlug.Home;
    private string? _switchValue =
        "{\"heroIdentity\":\"software developer\",\"title\":\"leftover title\"}";
}
