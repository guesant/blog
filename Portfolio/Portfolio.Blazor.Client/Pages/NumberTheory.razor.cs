using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class NumberTheory
{
    private string CanonicalPath => RequestPath;
    private string _aText = "84";
    private string _bText = "30";
    private string _limitText = "20";
    private NumberTheorySummary _summary = NumberTheoryCalculator.Analyze(84, 30, 20);
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "a")]
    private string? QueryA { get; set; }

    [SupplyParameterFromQuery(Name = "b")]
    private string? QueryB { get; set; }

    [SupplyParameterFromQuery(Name = "limit")]
    private string? QueryLimit { get; set; }
    private string Action => L["legacy_bbd73b253d23"];
    private string Title => L["legacy_0963092025ad"];
    private string Description => L["number_theory_description"];
    private string InputLabel => L["legacy_d6b96d7e7072"];
    private string SieveLimitLabel => L["legacy_b86f4c59f284"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string GcdLabel => L["legacy_8f026d3ef580"];
    private string LcmLabel => L["legacy_65887da7c1fe"];
    private string PrimeALabel => L["legacy_6f219bd7d136"];
    private string PrimeBLabel => L["legacy_3033365abd26"];
    private string FactorsLabel => L["legacy_8fda0e061eec"];
    private string PrimesLabel => L["legacy_d6a10da41eb8"];
    private string ErrorMessage =>
        Summary.Error == NumberTheoryError.LimitExceeded
            ? (L["legacy_189527346152"])
            : (L["legacy_fd687582e207"]);
    private string AText
    {
        get => _aText;
        set
        {
            _aText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string BText
    {
        get => _bText;
        set
        {
            _bText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private string LimitText
    {
        get => _limitText;
        set
        {
            _limitText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private NumberTheorySummary Summary => _summary;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _aText = QueryA ?? _aText;
            _bText = QueryB ?? _bText;
            _limitText = QueryLimit ?? _limitText;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate() =>
        _summary = NumberTheoryCalculator.Analyze(Parse(_aText), Parse(_bText), Parse(_limitText));

    private static int Parse(string value) =>
        int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var result)
            ? result
            : 0;

    private string BooleanLabel(bool value) =>
        value ? (L["legacy_28b03f1be88f"]) : (L["legacy_511ca48756c0"]);

    private static string Factorization(IReadOnlyList<int> factors) =>
        factors.Count == 0 ? "—" : string.Join(" × ", factors);

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
