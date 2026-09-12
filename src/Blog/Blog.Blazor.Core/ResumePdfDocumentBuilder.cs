using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Blog.Blazor.Core;

public static class ResumePdfDocumentBuilder
{
    public static string Build(
        PublicSiteSnapshot snapshot,
        string locale,
        Func<string, string>? localize = null
    )
    {
        var portuguese = locale == "pt-BR";
        localize ??= key => key;
        string T(string key, string fallback) => localize(key) == key ? fallback : localize(key);
        var profile = snapshot.Chrome.Profile;
        var resume = snapshot.Resume;
        var page = snapshot.Pages.TryGetValue("resume", out var pageValue) ? pageValue : default;
        var title = String(page, "title", T("resume_title", "résumé"));
        var sections = new StringBuilder();
        AddOptional(sections, T("resume_profile", "Profile"), String(resume, "summary"));
        AddTrajectory(
            sections,
            T("resume_leadership", "Leadership Activities"),
            Items(resume, "leadership")
        );
        AddTrajectory(
            sections,
            T("resume_experience", "Experience"),
            Items(resume, "experience"),
            includeOnly: true
        );
        AddSelectedCases(
            sections,
            T("resume_selected_work", "Selected work"),
            Items(resume, "selected_cases")
        );
        AddSkills(sections, T("resume_skills", "Skills"), Items(resume, "skills"));
        AddTrajectory(sections, T("resume_education", "Education"), Items(resume, "education"));
        AddDescribed(
            sections,
            T("resume_certificates", "Certificates"),
            Items(resume, "certificates")
        );
        AddDescribed(
            sections,
            T("resume_certifications", "Certifications"),
            Items(resume, "certifications")
        );
        AddDescribed(
            sections,
            T("resume_publications", "Publications"),
            Items(resume, "publications"),
            includeOnly: true
        );
        AddDescribed(
            sections,
            T("resume_technical_productions", "Technical Productions"),
            Items(resume, "technical_productions"),
            includeOnly: true
        );
        AddDescribed(
            sections,
            T("resume_events", "Events"),
            Items(resume, "events"),
            includeOnly: true
        );
        AddDescribed(
            sections,
            T("resume_awards", "Awards"),
            Items(resume, "awards"),
            includeOnly: true
        );
        AddLanguages(
            sections,
            T("resume_languages", "Languages"),
            Items(resume, "languages"),
            key => T(key, key)
        );
        var contact = string.Join(
            "\n    ",
            (snapshot.Chrome.Site.ContactProfiles ?? [])
                .Where(p => !string.IsNullOrWhiteSpace(p.Url))
                .Select(p => $"\\href{{{p.Url}}}{{{Escape(p.Label)}}}")
        );
        return Template(portuguese)
            .Replace("%%PDF_TITLE%%", Escape($"{title} {profile?.Name}"), StringComparison.Ordinal)
            .Replace(
                "%%PROFILE_NAME%%",
                Escape(profile?.Name ?? string.Empty),
                StringComparison.Ordinal
            )
            .Replace(
                "%%PROFILE_TITLE%%",
                Escape(profile?.Title ?? string.Empty),
                StringComparison.Ordinal
            )
            .Replace(
                "%%PROFILE_LOCATION%%",
                Escape(profile?.Location ?? string.Empty),
                StringComparison.Ordinal
            )
            .Replace("%%CONTACT_LINKS%%", contact, StringComparison.Ordinal)
            .Replace("%%SECTIONS%%", sections.ToString(), StringComparison.Ordinal);
    }

    public static string ComputeContentHash(PublicSiteSnapshot snapshot, string locale)
    {
        var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(snapshot) + "\n" + locale);
        return Convert.ToHexString(SHA256.HashData(bytes)).ToLowerInvariant();
    }

    private static void AddOptional(StringBuilder output, string heading, string value)
    {
        if (!string.IsNullOrWhiteSpace(value))
            output.AppendLine($"\\section{{{Escape(heading)}}}\n    {Escape(value)}\n");
    }

    private static void AddTrajectory(
        StringBuilder output,
        string heading,
        IEnumerable<JsonElement> items,
        bool includeOnly = false
    )
    {
        var rows = items
            .Where(x => !Bool(x, "hidden") && (!includeOnly || Bool(x, "includeInResume")))
            .Select(x =>
                Entry(
                    String(x, "organization"),
                    String(x, "period"),
                    String(x, "role"),
                    String(x, "location"),
                    StringArray(x, "highlights")
                )
            )
            .ToArray();
        if (rows.Length > 0)
            output.AppendLine(
                $"\\section{{{Escape(heading)}}}\n{string.Join("\n\n% ------\n\n", rows)}\n"
            );
    }

    private static void AddSelectedCases(
        StringBuilder output,
        string heading,
        IEnumerable<JsonElement> items
    )
    {
        var rows = items
            .Select(x =>
                Entry(
                    String(x, "title"),
                    String(x, "status"),
                    String(x, "meta"),
                    "",
                    [String(x, "summary"), String(x, "role"), String(x, "result")]
                )
            )
            .ToArray();
        if (rows.Length > 0)
            output.AppendLine(
                $"\\section{{{Escape(heading)}}}\n{string.Join("\n\n% ------\n\n", rows)}\n"
            );
    }

    private static void AddSkills(
        StringBuilder output,
        string heading,
        IEnumerable<JsonElement> items
    )
    {
        var rows = items
            .Select(x =>
            {
                var tech = Items(x, "technologies")
                    .Select(t => String(t, "name"))
                    .Where(v => v.Length > 0);
                return $"        \\item \\textbf{{{Escape(String(x, "name"))}:}} {Escape(string.Join(", ", tech))}";
            })
            .ToArray();
        if (rows.Length > 0)
            output.AppendLine(
                $"\\section{{{Escape(heading)}}}\n    \\begin{{itemize}}\n{string.Join("\n", rows)}\n    \\end{{itemize}}\n"
            );
    }

    private static void AddDescribed(
        StringBuilder output,
        string heading,
        IEnumerable<JsonElement> items,
        bool includeOnly = false
    )
    {
        var rows = items
            .Where(x => !Bool(x, "hidden") && (!includeOnly || Bool(x, "includeInPdf")))
            .Select(x =>
                Entry(
                    String(x, "name"),
                    String(x, "period"),
                    String(x, "issuer", String(x, "kind")),
                    String(x, "location"),
                    [String(x, "description")]
                )
            )
            .ToArray();
        if (rows.Length > 0)
            output.AppendLine(
                $"\\section{{{Escape(heading)}}}\n{string.Join("\n\n% ------\n\n", rows)}\n"
            );
    }

    private static void AddLanguages(
        StringBuilder output,
        string heading,
        IEnumerable<JsonElement> items,
        Func<string, string> translate
    )
    {
        var rows = items
            .Select(x =>
                $"        \\item {Escape(String(x, "name"))} ({Escape(String(x, "proficiency") == "native" ? translate("resume_native") : String(x, "proficiency"))})"
            )
            .ToArray();
        if (rows.Length > 0)
            output.AppendLine(
                $"\\section{{{Escape(heading)}}}\n    \\begin{{itemize}}\n{string.Join("\n", rows)}\n    \\end{{itemize}}\n"
            );
    }

    private static string Entry(
        string title,
        string period,
        string subtitle,
        string location,
        IEnumerable<string> details
    )
    {
        var body = string.Join(
            "\n",
            details
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .Select(v => $"            \\item {Escape(v)}")
        );
        return $"    \\cventry{{{Escape(title)}}}{{{Escape(period)}}}{{{Escape(subtitle)}}}{{{Escape(location)}}}\n"
            + (
                body.Length > 0
                    ? $"        \\begin{{itemize}}\n{body}\n        \\end{{itemize}}"
                    : ""
            );
    }

    private static IEnumerable<JsonElement> Items(JsonElement value, string? property = null)
    {
        if (
            property is not null
            && value.ValueKind == JsonValueKind.Object
            && value.TryGetProperty(property, out var child)
        )
            value = child;
        return value.ValueKind == JsonValueKind.Array ? value.EnumerateArray() : [];
    }

    private static string String(JsonElement value, string key, string fallback = "") =>
        value.ValueKind == JsonValueKind.Object
        && value.TryGetProperty(key, out var child)
        && child.ValueKind == JsonValueKind.String
            ? child.GetString() ?? fallback
            : fallback;

    private static bool Bool(JsonElement value, string key) =>
        value.ValueKind == JsonValueKind.Object
        && value.TryGetProperty(key, out var child)
        && child.ValueKind == JsonValueKind.True;

    private static IEnumerable<string> StringArray(JsonElement value, string key) =>
        Items(value, key)
            .Where(x => x.ValueKind == JsonValueKind.String)
            .Select(x => x.GetString() ?? "");

    private static string Escape(string value) =>
        value
            .Replace("\\", "\\textbackslash{}", StringComparison.Ordinal)
            .Replace("&", "\\&")
            .Replace("%", "\\%")
            .Replace("$", "\\$")
            .Replace("#", "\\#")
            .Replace("_", "\\_")
            .Replace("{", "\\{")
            .Replace("}", "\\}")
            .Replace("~", "\\textasciitilde{}")
            .Replace("^", "\\textasciicircum{}");

    private static string Template(bool portuguese) =>
        $"% generated by Blog.Blazor\n\\documentclass[a4paper,10pt]{{article}}\n\\usepackage{{fontspec}}\n\\setmainfont{{lmroman10-regular.otf}}[BoldFont=lmroman10-bold.otf,ItalicFont=lmroman10-italic.otf,BoldItalicFont=lmroman10-bolditalic.otf]\n{(portuguese ? "\\usepackage[portuguese]{babel}" : string.Empty)}\n\\usepackage{{geometry,parskip,microtype,enumitem,titlesec,array,tabularx,hyperref}}\n\\geometry{{top=1.5cm,bottom=1.5cm,left=1.5cm,right=1.5cm}}\n\\setcounter{{secnumdepth}}{{0}}\n\\setlist[itemize]{{leftmargin=0.75em,itemsep=0.2em,topsep=0.25em,parsep=0em,partopsep=0em}}\n\\pagestyle{{empty}}\n\\hypersetup{{pdftitle={{%%PDF_TITLE%%}},pdfauthor={{%%PROFILE_NAME%%}},colorlinks=true,linkcolor=black,urlcolor=black,bookmarksdepth=2}}\n\\titleformat{{\\section}}{{\\Large\\bfseries}}{{}}{{0em}}{{}}[\\titlerule\\vspace{{0.5ex}}]\n\\newcounter{{cventry}}\n\\newcommand{{\\cventry}}[4]{{\\refstepcounter{{cventry}}\\noindent\\begin{{tabularx}}{{\\textwidth}}{{@{{}}>{{\\raggedright\\arraybackslash}}X >{{\\raggedleft\\arraybackslash}}X@{{}}}}\\textbf{{#1}} & #2 \\\\ \\textit{{#3}} & \\textit{{#4}} \\\\ \\end{{tabularx}}}}\n\\begin{{document}}\n\\begin{{center}}{{\\LARGE \\textbf{{%%PROFILE_NAME%%}}}}\\\\[0.1cm]%%PROFILE_TITLE%%\\\\%%PROFILE_LOCATION%%\\\\%%CONTACT_LINKS%%\\end{{center}}\n%%SECTIONS%%\\end{{document}}";
}
