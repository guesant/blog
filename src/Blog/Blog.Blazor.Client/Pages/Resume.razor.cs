using System.Text.Json;
using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class Resume
{
    private string Title => PageField("title", L["resume"]);
    private string Description =>
        PageField("description", L["professional_trajectory_education_and_technical"]);
    private string CanonicalPath => L["resume_path"];
    private JsonElement ResumeData => Snapshot?.Resume ?? default;
    private IReadOnlyList<string> ResumePdfLocales => Snapshot?.ResumePdfLocales ?? [];

    private string Field(string name)
    {
        if (
            ResumeData.ValueKind != JsonValueKind.Object
            || !ResumeData.TryGetProperty(name, out var value)
            || value.ValueKind != JsonValueKind.String
        )
            return string.Empty;
        return value.GetString() ?? string.Empty;
    }

    private string PageField(string name, string fallback)
    {
        if (
            Snapshot?.Pages.TryGetValue("resume", out var page) != true
            || page.ValueKind != JsonValueKind.Object
            || !page.TryGetProperty(name, out var value)
            || value.ValueKind != JsonValueKind.String
        )
            return fallback;
        return value.GetString() ?? fallback;
    }

    private IReadOnlyList<PublicCaseStudy> SelectedCases =>
        ReadArray("selected_cases")
            .Select(value => JsonSerializer.Deserialize<PublicCaseStudy>(value.GetRawText())!)
            .Where(value => value is not null)
            .ToArray();
    private IReadOnlyList<ResumeSkill> Skills =>
        ReadArray("skills").Select(value => new ResumeSkill(value)).ToArray();
    private IReadOnlyList<ResumeLanguage> Languages =>
        ReadArray("languages").Select(value => new ResumeLanguage(value)).ToArray();

    private IReadOnlyList<JsonElement> ReadArray(string name) =>
        ResumeData.ValueKind == JsonValueKind.Object
        && ResumeData.TryGetProperty(name, out var value)
        && value.ValueKind == JsonValueKind.Array
            ? value.EnumerateArray().ToArray()
            : [];

    private IReadOnlyList<JsonElement> VisibleRows(string name) =>
        ReadArray(name)
            .Where(IsVisibleResumeEntry)
            .Where(row =>
                !name.Equals("experience", StringComparison.OrdinalIgnoreCase)
                || IsIncludedInResume(row)
            )
            .ToArray();

    private RenderFragment Rows(string name, string titleKey, string subtitleKey) =>
        builder =>
        {
            var rows = VisibleRows(name);
            var sequence = 0;
            foreach (var row in rows)
            {
                var title = StringValue(row, titleKey);
                var subtitle = StringValue(row, subtitleKey);
                var period = StringValue(row, "period");
                builder.OpenElement(sequence++, "div");
                builder.AddAttribute(sequence++, "class", "trajectory-row");
                builder.OpenElement(sequence++, "p");
                builder.AddAttribute(sequence++, "class", "period");
                builder.OpenComponent<SiteIcon>(sequence++);
                builder.AddComponentParameter(sequence++, nameof(SiteIcon.Name), "calendar");
                builder.AddComponentParameter(sequence++, nameof(SiteIcon.Size), 12);
                builder.CloseComponent();
                builder.AddContent(sequence++, period);
                builder.CloseElement();
                builder.OpenElement(sequence++, "div");
                if (!string.IsNullOrWhiteSpace(title))
                {
                    builder.OpenElement(sequence++, "h3");
                    builder.AddContent(sequence++, title);
                    builder.CloseElement();
                }
                if (!string.IsNullOrWhiteSpace(subtitle))
                {
                    builder.OpenElement(sequence++, "p");
                    builder.AddAttribute(sequence++, "class", "org");
                    builder.AddContent(sequence++, subtitle);
                    builder.CloseElement();
                }
                var highlights = StringArray(row, "highlights");
                if (highlights.Count > 0)
                {
                    builder.OpenElement(sequence++, "p");
                    builder.AddContent(sequence++, string.Join(" ", highlights));
                    builder.CloseElement();
                }
                builder.CloseElement();
                builder.CloseElement();
            }
        };

    private string SelectedCaseMeta(PublicCaseStudy item, int number) =>
        string.Join(
            " · ",
            new[] { L["selected_case_label", number].Value, item.Meta }.Where(value =>
                !string.IsNullOrWhiteSpace(value)
            )
        );

    private static bool IsVisibleResumeEntry(JsonElement value) =>
        !value.TryGetProperty("hidden", out var hidden) || hidden.ValueKind != JsonValueKind.True;

    private static bool IsIncludedInResume(JsonElement value) =>
        value.TryGetProperty("includeInResume", out var included)
        && included.ValueKind == JsonValueKind.True;

    private static string StringValue(JsonElement value, string key) =>
        value.ValueKind == JsonValueKind.Object
        && value.TryGetProperty(key, out var field)
        && field.ValueKind == JsonValueKind.String
            ? field.GetString() ?? string.Empty
            : string.Empty;

    private static IReadOnlyList<string> StringArray(JsonElement value, string key) =>
        value.ValueKind == JsonValueKind.Object
        && value.TryGetProperty(key, out var field)
        && field.ValueKind == JsonValueKind.Array
            ? field
                .EnumerateArray()
                .Where(item => item.ValueKind == JsonValueKind.String)
                .Select(item => item.GetString() ?? string.Empty)
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .ToArray()
            : [];

    private static string? SafeUrl(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https"
            ? uri.AbsoluteUri
            : null;

    private static string LocalizedTechnologyUrl(PublicTechnology technology) =>
        LocalizedUrls.Current($"/technologies/{technology.Slug}");

    private static string PdfLabel(string locale) => CultureCatalog.LanguageCode(locale);

    private sealed class ResumeSkill(JsonElement value)
    {
        public string Name { get; } = StringValue(value, "name");
        public IReadOnlyList<PublicTechnology> Technologies { get; } =
            value.TryGetProperty("technologies", out var items)
            && items.ValueKind == JsonValueKind.Array
                ? items
                    .EnumerateArray()
                    .Select(item => new PublicTechnology(
                        item.GetProperty("slug").GetString() ?? string.Empty,
                        item.GetProperty("name").GetString() ?? string.Empty
                    ))
                    .ToArray()
                : [];
    }

    private sealed class ResumeLanguage(JsonElement value)
    {
        public string Name { get; } = StringValue(value, "name");
        public string Proficiency { get; } = StringValue(value, "proficiency");
    }
}
