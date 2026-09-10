using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class FractionCalculator
{
    private string CanonicalPath => RequestPath;
    private string _numeratorA = "1",
        _denominatorB = "2",
        _numeratorC = "1",
        _denominatorD = "3",
        _operationText = "+";
    private FractionResult _result = Portfolio.Blazor.Core.FractionCalculator.Calculate(
        "1/2",
        '+',
        "1/3"
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "a")]
    private string? QueryA { get; set; }

    [SupplyParameterFromQuery(Name = "b")]
    private string? QueryB { get; set; }

    [SupplyParameterFromQuery(Name = "c")]
    private string? QueryC { get; set; }

    [SupplyParameterFromQuery(Name = "d")]
    private string? QueryD { get; set; }

    [SupplyParameterFromQuery(Name = "operation")]
    private string? QueryOperation { get; set; }
    private string Action => L["legacy_e456e11dec65"];
    private string Title => L["legacy_0a1d87726677"];
    private string Description => L["legacy_ec7b8657bce0"];
    private string InputLabel => L["legacy_cf8b4a6ab201"];
    private string OperationLabel => L["legacy_bcb0412df16b"];
    private string ResultLabel => L["legacy_f99cb3950d4d"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string ErrorLabel => L["legacy_67b132c6f377"];
    private string NumeratorA
    {
        get => _numeratorA;
        set
        {
            _numeratorA = value;
            Recalculate();
        }
    }
    private string DenominatorB
    {
        get => _denominatorB;
        set
        {
            _denominatorB = value;
            Recalculate();
        }
    }
    private string NumeratorC
    {
        get => _numeratorC;
        set
        {
            _numeratorC = value;
            Recalculate();
        }
    }
    private string DenominatorD
    {
        get => _denominatorD;
        set
        {
            _denominatorD = value;
            Recalculate();
        }
    }
    private string OperationText
    {
        get => _operationText;
        set
        {
            _operationText = value;
            Recalculate();
        }
    }
    private FractionResult Result => _result;
    private static IReadOnlyList<SiteSelectOption> OperationOptions =>
        [new("+", "+"), new("-", "−"), new("*", "×"), new("/", "/")];

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _numeratorA = QueryA ?? _numeratorA;
        _denominatorB = QueryB ?? _denominatorB;
        _numeratorC = QueryC ?? _numeratorC;
        _denominatorD = QueryD ?? _denominatorD;
        _operationText = QueryOperation ?? _operationText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = Portfolio.Blazor.Core.FractionCalculator.Calculate(
            $"{_numeratorA}/{_denominatorB}",
            _operationText.FirstOrDefault(),
            $"{_numeratorC}/{_denominatorD}"
        );

    private static string Decimal(Fraction fraction) =>
        (
            double.Parse(fraction.Numerator.ToString(), CultureInfo.InvariantCulture)
            / double.Parse(fraction.Denominator.ToString(), CultureInfo.InvariantCulture)
        ).ToString("G12", CultureInfo.InvariantCulture);
}
