using System.Text.RegularExpressions;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class ContentActions
{
    [Parameter]
    public string Title { get; set; } = "content";

    [Parameter]
    public string Url { get; set; } = "";

    [Parameter]
    public string Body { get; set; } = "";

    [Parameter]
    public string? ExternalUrl { get; set; }

    [Parameter]
    public string? DownloadUrl { get; set; }
    private string Filename => Slug(Title);
    private string PlainText =>
        Regex
            .Replace(MarkdownRenderer.ToHtml(Body), "<[^>]+>", " ")
            .Replace("&amp;", "&")
            .Replace("&lt;", "<")
            .Replace("&gt;", ">")
            .Trim();
    private string CopyPageLabel => L["copy_page"];
    private string MoreActionsLabel => L["more_actions"];
    private string CopyUrlLabel => L["copy_url"];
    private string CopyTextLabel => L["copy_text"];
    private string CopyMarkdownLabel => L["copy_markdown"];
    private string CopiedLabel => L["copied"];
    private string DownloadTextLabel => L["download_text"];
    private string DownloadMarkdownLabel => L["download_markdown"];
    private string ExternalLabel => L["open_source"];
    private string DownloadFilesLabel => L["download_files"];

    private static string Slug(string value)
    {
        var slug = Regex.Replace(value.ToLowerInvariant(), "[^a-z0-9]+", "-").Trim('-');
        return string.IsNullOrWhiteSpace(slug) ? "content" : slug;
    }
}
