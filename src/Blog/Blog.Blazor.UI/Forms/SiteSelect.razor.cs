namespace Blog.Blazor.UI.Forms;

public partial class SiteSelect
{
    [Parameter]
    public IReadOnlyList<SiteSelectOption> Options { get; set; } = [];

    [Parameter]
    public string Id { get; set; } = string.Empty;

    [Parameter]
    public string Name { get; set; } = string.Empty;

    [Parameter]
    public string Class { get; set; } = "form-select";

    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    [Parameter]
    public string EmptyText { get; set; } = string.Empty;

    [Parameter]
    public string LoadingText { get; set; } = "loading…";

    [Parameter]
    public bool Disabled { get; set; }

    [Parameter]
    public bool Loading { get; set; }

    [Parameter]
    public bool Required { get; set; }

    [Parameter]
    public bool ReadOnly { get; set; }

    [Parameter]
    public bool Clearable { get; set; }

    [Parameter]
    public string ClearLabel { get; set; } = "clear";

    [Parameter]
    public string ClearAriaLabel { get; set; } = "clear";

    /// <summary>Options rendered per page inside the popup. Once Options exceeds this, the popup
    /// gains a text filter and a "show more" step so the DOM never holds the whole list at once.</summary>
    [Parameter]
    public int PageSize { get; set; } = 20;

    /// <summary>Forces the popup filter on even below PageSize.</summary>
    [Parameter]
    public bool Searchable { get; set; }

    [Parameter]
    public string SearchPlaceholder { get; set; } = "search…";

    /// <summary>Label of the "show more" step, given how many options are still hidden.</summary>
    [Parameter]
    public Func<int, string> MoreLabel { get; set; } = hidden => $"show {hidden} more";

    private string _search = string.Empty;
    private int _page = 1;

    private bool ShowSearch => Searchable || Options.Count > PageSize;
    private List<SiteSelectOption> FilteredOptions =>
        string.IsNullOrWhiteSpace(_search)
            ? Options.ToList()
            : Options
                .Where(option => option.Label.Contains(_search, StringComparison.OrdinalIgnoreCase))
                .ToList();
    private List<SiteSelectOption> VisibleOptions =>
        FilteredOptions.Take(Math.Max(PageSize, 1) * _page).ToList();
    private int HiddenCount => Math.Max(0, FilteredOptions.Count - VisibleOptions.Count);

    private void HandleSearchChanged(string value)
    {
        _search = value;
        _page = 1;
    }

    private void ShowMore() => _page++;

    [CascadingParameter]
    private SiteFieldContext? FieldContext { get; set; }

    private string ResolvedId =>
        string.IsNullOrWhiteSpace(Id) ? FieldContext?.Id ?? string.Empty : Id;
    private bool ResolvedRequired => Required || FieldContext?.Required == true;
    private bool ResolvedInvalid => HasValidationErrors || FieldContext?.Invalid == true;
    private string? ResolvedDescribedBy =>
        string.IsNullOrWhiteSpace(ValidationMessageId)
            ? FieldContext?.DescribedBy
            : ValidationMessageId;

    private string ControlClass =>
        string.Join(
            ' ',
            new[] { Class, CssClass }.Where(value => !string.IsNullOrWhiteSpace(value))
        );
    private string ValidationMessageId =>
        string.IsNullOrWhiteSpace(ResolvedId) ? string.Empty : $"{ResolvedId}-validation";
    private bool HasValidationErrors =>
        EditContext is not null && EditContext.GetValidationMessages(FieldIdentifier).Any();

    private Dictionary<string, object> TriggerAttributes
    {
        get
        {
            var attributes = new Dictionary<string, object> { ["class"] = ControlClass };
            if (!string.IsNullOrWhiteSpace(ResolvedId))
                attributes["id"] = ResolvedId;
            if (!string.IsNullOrWhiteSpace(Name))
                attributes["name"] = Name;
            if (FieldContext is not null)
                attributes["aria-labelledby"] = SiteFieldLabel.LabelId(FieldContext.Id);
            if (!string.IsNullOrWhiteSpace(ResolvedDescribedBy))
                attributes["aria-describedby"] = ResolvedDescribedBy!;
            attributes["aria-invalid"] = ResolvedInvalid ? "true" : "false";
            attributes["aria-busy"] = Loading ? "true" : "false";
            return attributes;
        }
    }

    private static readonly Dictionary<string, object> ContentAttributes = new()
    {
        ["class"] = "site-select-popup",
    };

    private bool IsNeutralOption(SiteSelectOption option) =>
        string.IsNullOrEmpty(option.Value)
        || string.Equals(option.Label, ClearLabel, StringComparison.OrdinalIgnoreCase);

    private bool HasNeutralOption => Options.Any(IsNeutralOption);

    private string NeutralValue => Options.FirstOrDefault(IsNeutralOption)?.Value ?? string.Empty;

    private bool ShowClearButton =>
        Clearable && !string.Equals(CurrentValue, NeutralValue, StringComparison.OrdinalIgnoreCase);

    private string? SelectedIcon =>
        Options.FirstOrDefault(option => option.Value == CurrentValue)?.Icon;

    private string ResolveDisplayText(string value) =>
        Options.FirstOrDefault(option => option.Value == value)?.Label
        ?? (string.IsNullOrEmpty(value) ? Placeholder : value);

    protected override bool TryParseValueFromString(
        string? value,
        out string result,
        out string validationErrorMessage
    )
    {
        result = value ?? string.Empty;
        validationErrorMessage = string.Empty;
        return true;
    }

    private Task HandleClear()
    {
        CurrentValue = NeutralValue;
        return Task.CompletedTask;
    }
}
