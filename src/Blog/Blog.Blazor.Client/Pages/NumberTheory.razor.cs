using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

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
    private string Action => L["tools_number_theory"];
    private string Title => ToolsL["number_theory_title"];
    private string Description => ToolsL["number_theory_lead"];
    private string InputLabel => L["values"];
    private string SieveLimitLabel => L["sieve_limit"];
    private string SubmitLabel => L["calculate"];
    private string GcdLabel => L["gcd"];
    private string LcmLabel => L["lcm"];
    private string PrimeALabel => L["a_is_prime"];
    private string PrimeBLabel => L["b_is_prime"];
    private string FactorsLabel => L["factors_and_primes"];
    private string PrimesLabel => L["primes_up_to_the_limit"];
    private string ErrorMessage =>
        Summary.Error == NumberTheoryError.LimitExceeded
            ? (L["the_limit_must_be_between_2_and_100000"])
            : (L["provide_non_zero_values_for_a_and_b"]);
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

    private string BooleanLabel(bool value) => value ? (L["yes"]) : (L["no"]);

    private static string Factorization(IReadOnlyList<int> factors) =>
        factors.Count == 0 ? "—" : string.Join(" × ", factors);

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
