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
    private string Action => L["legacy_991937e77d7a"];
    private string Title => ToolsL["prime_factorization_title"];
    private string Description => ToolsL["prime_factorization_lead"];
    private string InputLabel => L["legacy_b831d42d15e4"];
    private string NumberLabel => L["legacy_4bc3227bbd62"];
    private string ResultLabel => L["legacy_efd3359baf4d"];
    private string SubmitLabel => L["legacy_d3b5a92ba5e4"];
    private string ErrorLabel =>
        Result.Error == PrimeFactorizationError.LimitExceeded
            ? (L["legacy_6d113ce3f155"])
            : (L["legacy_595e16b252fd"]);
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
