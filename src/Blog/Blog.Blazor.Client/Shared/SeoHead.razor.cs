using System.Text.Encodings.Web;
using System.Text.Json;
using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Shared;

public partial class SeoHead
{
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    [Parameter]
    public string Description { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string CanonicalPath { get; set; } = "/";

    [Parameter]
    public string? EnglishPath { get; set; }

    [Parameter]
    public string? PortuguesePath { get; set; }

    [Parameter]
    public string OgType { get; set; } = "website";

    [Parameter]
    public string? PublishedTime { get; set; }

    [CascadingParameter]
    public PublicSiteSnapshot? Snapshot { get; set; }

    protected override void OnParametersSet()
    {
        EnglishPath ??= CultureCatalog.RemoveCulturePrefix(CanonicalPath);
        PortuguesePath ??= CultureCatalog.HasPortuguesePrefix(CanonicalPath)
            ? CanonicalPath
            : $"/pt-BR{CanonicalPath}";
    }

    private string AbsoluteUrl(string path) => Navigation.ToAbsoluteUri(path).AbsoluteUri;

    private string? OgImageUrl =>
        SeoField("image") is { Length: > 0 } image ? AbsoluteUrl(image) : null;
    private string OgImageAlt => SeoField("imageAlt") is { Length: > 0 } alt ? alt : Title;

    private string? SeoField(string key) =>
        Snapshot?.Chrome.Site.Seo is { ValueKind: JsonValueKind.Object } seo
        && seo.TryGetProperty(key, out var field)
        && field.ValueKind == JsonValueKind.String
            ? field.GetString()
            : null;

    private string StructuredDataJson()
    {
        var path = CultureCatalog.RemoveCulturePrefix(CanonicalPath);
        var type = SchemaType(path);
        var schema = new Dictionary<string, object?>
        {
            ["@context"] = "https://schema.org",
            ["@type"] = type,
            ["url"] = AbsoluteUrl(CanonicalPath),
        };

        if (type is "Person")
        {
            schema["name"] = Snapshot?.Chrome.Profile?.Name;
            schema["sameAs"] =
                (Snapshot?.Chrome.Site.ContactProfiles ?? [])
                    .Select(profile => profile.Url)
                    .Where(url =>
                        Uri.TryCreate(url, UriKind.Absolute, out var uri)
                        && uri.Scheme is "http" or "https"
                    )
                    .ToArray()
                ?? [];
        }
        else if (type is "Article")
        {
            schema["headline"] = Title;
            schema["description"] = Description;
            if (!string.IsNullOrWhiteSpace(PublishedTime))
                schema["datePublished"] = PublishedTime;
            if (
                path.StartsWith("/writing/", StringComparison.OrdinalIgnoreCase)
                || path.StartsWith("/cases/", StringComparison.OrdinalIgnoreCase)
            )
            {
                schema["author"] = new Dictionary<string, object?>
                {
                    ["@type"] = "Person",
                    ["name"] = Snapshot?.Chrome.Profile?.Name,
                };
            }
        }
        else if (type is "CollectionPage")
        {
            schema["name"] = Title;
            schema["description"] = Description;
        }
        else if (type is "SoftwareSourceCode")
        {
            schema["name"] = Title;
            schema["description"] = Description;
        }

        return JsonSerializer.Serialize(
            schema,
            new JsonSerializerOptions { Encoder = JavaScriptEncoder.Default }
        );
    }

    private static string SchemaType(string path)
    {
        if (path.Equals("/knowledge-map", StringComparison.OrdinalIgnoreCase))
            return "WebPage";
        if (path.StartsWith("/snippets/", StringComparison.OrdinalIgnoreCase))
            return "SoftwareSourceCode";
        if (path.Equals("/snippets", StringComparison.OrdinalIgnoreCase))
            return "CollectionPage";
        if (
            path.StartsWith("/writing/", StringComparison.OrdinalIgnoreCase)
            || path.StartsWith("/cases/", StringComparison.OrdinalIgnoreCase)
            || path.StartsWith("/findings/", StringComparison.OrdinalIgnoreCase)
        )
            return "Article";
        if (
            path.Equals("/cases", StringComparison.OrdinalIgnoreCase)
            || path.Equals("/projects", StringComparison.OrdinalIgnoreCase)
            || path.StartsWith("/collections/", StringComparison.OrdinalIgnoreCase)
            || path.Equals("/topics", StringComparison.OrdinalIgnoreCase)
            || path.StartsWith("/topics/", StringComparison.OrdinalIgnoreCase)
            || path.Equals("/technologies", StringComparison.OrdinalIgnoreCase)
            || path.StartsWith("/technologies/", StringComparison.OrdinalIgnoreCase)
        )
            return "CollectionPage";
        return "Person";
    }
}
