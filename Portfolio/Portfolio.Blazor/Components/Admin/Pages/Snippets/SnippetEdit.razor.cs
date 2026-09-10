using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Blazor.Components.Admin.Pages.Snippets;

public partial class SnippetEdit
{
    private static readonly string[] FileLanguages =
    [
        "csharp",
        "razor",
        "javascript",
        "typescript",
        "python",
        "bash",
        "sql",
        "css",
        "html",
        "json",
        "yaml",
        "markdown",
        "dockerfile",
    ];

    [Parameter]
    public int? Id { get; set; }

    public sealed class SnippetFileFormModel
    {
        public string Path { get; set; } = string.Empty;
        public string? Language { get; set; }
        public string Content { get; set; } = string.Empty;
    }

    private static readonly IReadOnlyList<SiteLocaleTab> _locales =
    [
        new("en", "English"),
        new("pt-BR", "Português"),
    ];

    private Snippet _snippet = new();
    private SnippetTranslation _translationEn = new() { Locale = "en" };
    private SnippetTranslation _translationPtBr = new() { Locale = "pt-BR" };
    private List<SnippetFileFormModel> _files = [];
    private List<string> _knownLanguages = [];
    private string _activeLocale = "en";

    private EditContext _snippetEditContext = default!;
    private EditContext _enEditContext = default!;
    private EditContext _ptEditContext = default!;

    private bool IsEditing => Id.HasValue;
    protected override string EntityLabel => "snippet";
    protected override string ListRoute => "/admin/snippets";

    private string FilesDescription =>
        _knownLanguages.Count > 0
            ? $"Existing languages in use: {string.Join(", ", _knownLanguages)}."
            : "Free text, e.g. \"typescript\", \"csharp\", \"bash\".";

    protected override async Task LoadAsync(PortfolioAdminDbContext dbContext)
    {
        _knownLanguages = await dbContext
            .SnippetFiles.AsNoTracking()
            .Where(file => file.Language != null && file.Language != "")
            .Select(file => file.Language!)
            .Distinct()
            .OrderBy(language => language)
            .ToListAsync();

        if (Id is int id)
        {
            var snippet = await dbContext
                .Snippets.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.Files)
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate => candidate.Id == id);

            if (snippet is null)
            {
                ToastService.Error("Snippet not found.");
                Navigation.NavigateTo("/admin/snippets");
                return;
            }

            _snippet = snippet;
            _translationEn =
                snippet.Translations.FirstOrDefault(translation => translation.Locale == "en")
                ?? new SnippetTranslation { SnippetId = snippet.Id, Locale = "en" };
            _translationPtBr =
                snippet.Translations.FirstOrDefault(translation => translation.Locale == "pt-BR")
                ?? new SnippetTranslation { SnippetId = snippet.Id, Locale = "pt-BR" };
            _files = snippet
                .Files.OrderBy(file => file.Order)
                .ThenBy(file => file.Id)
                .Select(file => new SnippetFileFormModel
                {
                    Path = file.Path,
                    Language = file.Language,
                    Content = file.Content,
                })
                .ToList();
        }

        _snippetEditContext = new EditContext(_snippet);
        _enEditContext = new EditContext(_translationEn);
        _ptEditContext = new EditContext(_translationPtBr);
    }

    private void HandleAddFile() => _files.Add(new SnippetFileFormModel());

    private void HandleRemoveFile(int index) => _files.RemoveAt(index);

    protected override Task<bool> ValidateAsync()
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Title);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Title);
        var englishValid = !englishHasContent || _enEditContext.Validate();
        var portugueseValid = !portugueseHasContent || _ptEditContext.Validate();

        if (!englishValid || !portugueseValid)
        {
            return Task.FromResult(false);
        }

        if (!englishHasContent && !portugueseHasContent)
        {
            SaveError = "Provide a title in at least one language.";
            return Task.FromResult(false);
        }

        var effectiveFiles = _files
            .Where(file =>
                !string.IsNullOrWhiteSpace(file.Path) || !string.IsNullOrWhiteSpace(file.Content)
            )
            .ToList();

        if (
            effectiveFiles.Any(file =>
                string.IsNullOrWhiteSpace(file.Path) || string.IsNullOrWhiteSpace(file.Content)
            )
        )
        {
            SaveError = "Every file needs both a path and content.";
            return Task.FromResult(false);
        }

        return Task.FromResult(true);
    }

    protected override async Task ApplyChangesAsync(PortfolioAdminDbContext dbContext)
    {
        var englishHasContent = !string.IsNullOrWhiteSpace(_translationEn.Title);
        var portugueseHasContent = !string.IsNullOrWhiteSpace(_translationPtBr.Title);
        var effectiveFiles = _files
            .Where(file =>
                !string.IsNullOrWhiteSpace(file.Path) || !string.IsNullOrWhiteSpace(file.Content)
            )
            .ToList();

        if (Id is int id)
        {
            var snippet = await dbContext
                .Snippets.Include(candidate => candidate.Translations)
                .Include(candidate => candidate.Files)
                .FirstAsync(candidate => candidate.Id == id);

            ApplySnippetFields(snippet, _snippet);
            ApplyTranslation(snippet, "en", _translationEn, englishHasContent);
            ApplyTranslation(snippet, "pt-BR", _translationPtBr, portugueseHasContent);

            dbContext.SnippetFiles.RemoveRange(snippet.Files);
            for (var index = 0; index < effectiveFiles.Count; index++)
            {
                dbContext.SnippetFiles.Add(
                    new SnippetFile
                    {
                        SnippetId = snippet.Id,
                        Path = effectiveFiles[index].Path,
                        Language = effectiveFiles[index].Language,
                        Content = effectiveFiles[index].Content,
                        Order = index,
                    }
                );
            }
        }
        else
        {
            var snippet = new Snippet();
            ApplySnippetFields(snippet, _snippet);

            if (englishHasContent)
            {
                snippet.Translations.Add(CloneTranslation(_translationEn, "en"));
            }

            if (portugueseHasContent)
            {
                snippet.Translations.Add(CloneTranslation(_translationPtBr, "pt-BR"));
            }

            for (var index = 0; index < effectiveFiles.Count; index++)
            {
                snippet.Files.Add(
                    new SnippetFile
                    {
                        Path = effectiveFiles[index].Path,
                        Language = effectiveFiles[index].Language,
                        Content = effectiveFiles[index].Content,
                        Order = index,
                    }
                );
            }

            snippet.Order = await NextOrderAsync(dbContext.Snippets, entity => entity.Order);
            snippet.PublicId = PublicIds.New();
            dbContext.Snippets.Add(snippet);
        }
    }

    private static void ApplySnippetFields(Snippet target, Snippet source)
    {
        target.Slug = source.Slug;
        target.Hidden = source.Hidden;
        target.Order = source.Order;
        target.PublishedAt = source.PublishedAt;
        target.ShowHistory = source.ShowHistory;
    }

    private static void ApplyTranslation(
        Snippet snippet,
        string locale,
        SnippetTranslation source,
        bool hasContent
    )
    {
        if (!hasContent)
        {
            return;
        }

        var existing = snippet.Translations.FirstOrDefault(translation =>
            translation.Locale == locale
        );
        if (existing is null)
        {
            snippet.Translations.Add(CloneTranslation(source, locale));
            return;
        }

        existing.Title = source.Title;
        existing.Description = source.Description;
    }

    private static SnippetTranslation CloneTranslation(SnippetTranslation source, string locale) =>
        new()
        {
            Locale = locale,
            Title = source.Title,
            Description = source.Description,
        };
}
