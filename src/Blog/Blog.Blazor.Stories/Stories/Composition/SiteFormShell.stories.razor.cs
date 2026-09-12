namespace Blog.Blazor.Stories.Stories.Composition;

public partial class SiteFormShell_stories
{
    private sealed class ShellModel
    {
        public string? Title { get; set; } = "Sample snippet";
        public string? Slug { get; set; } = "sample-snippet";
    }

    private readonly ShellModel _model = new();
}
