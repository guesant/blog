namespace Portfolio.Blazor.Core;

public enum PageFieldValueKind
{
    Text,
    LongText,
}

[Flags]
public enum PageFieldSlug
{
    None = 0,
    Credits = 1 << 0,
    Resume = 1 << 1,
    Achados = 1 << 2,
    Cases = 1 << 3,
    Contact = 1 << 4,
    Writing = 1 << 5,
    Projects = 1 << 6,
    About = 1 << 7,
    Portfolio = 1 << 8,
    Home = 1 << 9,
    Seo = 1 << 10,
}

public readonly record struct PageFieldDefinition(
    string Key,
    PageFieldSlug Slugs,
    string Label,
    string PortugueseLabel,
    PageFieldValueKind ValueKind = PageFieldValueKind.Text
);

public static class PageFieldCatalog
{
    // IMPORTANT: takes a plain locale string rather than CultureInfo - Blazor WebAssembly runs
    // with invariant globalization, where CultureInfo.GetCultureInfo("en"/"pt-BR") throws
    // CultureNotFoundException instead of returning a culture.
    public static string LocalizedLabel(PageFieldDefinition field, string locale) =>
        locale.Equals("pt-BR", StringComparison.OrdinalIgnoreCase)
            ? field.PortugueseLabel
            : field.Label;

    private static readonly PageFieldDefinition[] Definitions =
    [
        new("title", PageFieldSlug.Seo, "Meta title", "Título (meta)"),
        new(
            "description",
            PageFieldSlug.Seo,
            "Meta description",
            "Descrição (meta)",
            PageFieldValueKind.LongText
        ),
        new("keywords", PageFieldSlug.Seo, "Keywords", "Palavras-chave"),
        new("image", PageFieldSlug.Seo, "Share image URL", "URL da imagem de compartilhamento"),
        new("imageAlt", PageFieldSlug.Seo, "Share image alt text", "Texto alternativo da imagem"),
        new(
            "eyebrow",
            PageFieldSlug.Achados
                | PageFieldSlug.Cases
                | PageFieldSlug.Contact
                | PageFieldSlug.Writing
                | PageFieldSlug.Projects
                | PageFieldSlug.About,
            "Eyebrow",
            "Chamada"
        ),
        new(
            "title",
            PageFieldSlug.Credits
                | PageFieldSlug.Resume
                | PageFieldSlug.Achados
                | PageFieldSlug.Cases
                | PageFieldSlug.Contact
                | PageFieldSlug.Writing
                | PageFieldSlug.Projects
                | PageFieldSlug.About,
            "Title",
            "Título"
        ),
        new(
            "description",
            PageFieldSlug.Credits
                | PageFieldSlug.Resume
                | PageFieldSlug.Achados
                | PageFieldSlug.Cases
                | PageFieldSlug.Contact
                | PageFieldSlug.Writing
                | PageFieldSlug.Projects
                | PageFieldSlug.About,
            "Description",
            "Descrição",
            PageFieldValueKind.LongText
        ),
        new("selectedLabel", PageFieldSlug.Projects, "Selected label", "Rótulo \"selecionados\""),
        new("archiveLabel", PageFieldSlug.Projects, "Archive label", "Rótulo do arquivo"),
        new(
            "experimentsTitle",
            PageFieldSlug.Projects,
            "Experiments title",
            "Título dos experimentos"
        ),
        new("lead", PageFieldSlug.About, "Lead", "Introdução", PageFieldValueKind.LongText),
        new("context", PageFieldSlug.About, "Context", "Contexto", PageFieldValueKind.LongText),
        new("storyEyebrow", PageFieldSlug.About, "Story eyebrow", "Chamada da história"),
        new("storyTitle", PageFieldSlug.About, "Story title", "Título da história"),
        new("story", PageFieldSlug.About, "Story", "História", PageFieldValueKind.LongText),
        new(
            "heroIdentity",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Hero identity",
            "Identidade do hero"
        ),
        new(
            "heroExperience",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Hero experience",
            "Experiência do hero"
        ),
        new(
            "heroCurrentFocus",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Hero current focus",
            "Foco atual do hero"
        ),
        new(
            "availableLabel",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Available label",
            "Rótulo disponível"
        ),
        new(
            "workEyebrow",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Work eyebrow",
            "Chamada do trabalho"
        ),
        new(
            "workTitle",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Work title",
            "Título do trabalho"
        ),
        new(
            "workDescription",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Work description",
            "Descrição do trabalho",
            PageFieldValueKind.LongText
        ),
        new(
            "projectsEyebrow",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Projects eyebrow",
            "Chamada dos projetos"
        ),
        new(
            "projectsTitle",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Projects title",
            "Título dos projetos"
        ),
        new(
            "projectsDescription",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Projects description",
            "Descrição dos projetos",
            PageFieldValueKind.LongText
        ),
        new(
            "experimentsSummary",
            PageFieldSlug.Portfolio | PageFieldSlug.Home,
            "Experiments summary",
            "Resumo dos experimentos"
        ),
        new("unavailableLabel", PageFieldSlug.Home, "Unavailable label", "Rótulo indisponível"),
        new(
            "experienceEyebrow",
            PageFieldSlug.Home,
            "Experience eyebrow",
            "Chamada da experiência"
        ),
        new("experienceTitle", PageFieldSlug.Home, "Experience title", "Título da experiência"),
        new(
            "experienceDescription",
            PageFieldSlug.Home,
            "Experience description",
            "Descrição da experiência",
            PageFieldValueKind.LongText
        ),
        new(
            "currentlyExploringLabel",
            PageFieldSlug.Home,
            "Currently exploring label",
            "Rótulo \"explorando atualmente\""
        ),
        new(
            "recurringTechnologiesLabel",
            PageFieldSlug.Home,
            "Recurring technologies label",
            "Rótulo de tecnologias recorrentes"
        ),
        new("writingEyebrow", PageFieldSlug.Home, "Writing eyebrow", "Chamada da escrita"),
        new("writingTitle", PageFieldSlug.Home, "Writing title", "Título da escrita"),
        new(
            "writingDescription",
            PageFieldSlug.Home,
            "Writing description",
            "Descrição da escrita",
            PageFieldValueKind.LongText
        ),
        new("contactEyebrow", PageFieldSlug.Home, "Contact eyebrow", "Chamada do contato"),
        new("contactTitle", PageFieldSlug.Home, "Contact title", "Título do contato"),
        new(
            "contactDescription",
            PageFieldSlug.Home,
            "Contact description",
            "Descrição do contato",
            PageFieldValueKind.LongText
        ),
    ];

    public static IReadOnlyList<PageFieldDefinition> All => Definitions;

    public static PageFieldSlug SlugFor(string? slug) =>
        slug?.Trim().ToLowerInvariant() switch
        {
            "credits" => PageFieldSlug.Credits,
            "resume" => PageFieldSlug.Resume,
            "achados" => PageFieldSlug.Achados,
            "cases" => PageFieldSlug.Cases,
            "contact" => PageFieldSlug.Contact,
            "writing" => PageFieldSlug.Writing,
            "projects" => PageFieldSlug.Projects,
            "about" => PageFieldSlug.About,
            "portfolio" => PageFieldSlug.Portfolio,
            "home" => PageFieldSlug.Home,
            _ => PageFieldSlug.None,
        };
}
