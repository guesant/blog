using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class PrimeFactorization
{
    private string CanonicalPath => RequestPath;
    private string _numberText = "360";
    private PrimeFactorizationResult _result = PrimeFactorizationCalculator.Factor(360);
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "number")]
    private string? QueryNumber { get; set; }
    private string Action => L["tools_prime_factorization"];
    private string Title => ToolsL["prime_factorization_title"];
    private string Description => ToolsL["prime_factorization_lead"];
    private string InputLabel => L["number"];
    private string NumberLabel => L["integer"];
    private string ResultLabel => L["prime_factors"];
    private string SubmitLabel => L["factorize"];
    private string ErrorLabel =>
        Result.Error == PrimeFactorizationError.LimitExceeded
            ? (L["use_a_number_between_1_000_000_000_000_and_1"])
            : (L["provide_an_integer_other_than_zero_1_and_1"]);
    private string NumberText
    {
        get => _numberText;
        set
        {
            _numberText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private PrimeFactorizationResult Result => _result;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _numberText = QueryNumber ?? _numberText;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate() => _result = PrimeFactorizationCalculator.Factor(Parse(_numberText));

    private static long Parse(string value) =>
        long.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var result)
            ? result
            : 0;

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
