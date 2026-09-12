using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class FractionCalculator
{
    private string CanonicalPath => RequestPath;
    private string _numeratorA = "1",
        _denominatorB = "2",
        _numeratorC = "1",
        _denominatorD = "3",
        _operationText = "+";
    private FractionResult _result = Blog.Blazor.Core.FractionCalculator.Calculate(
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
    private string Action => L["tools_fraction_calculator"];
    private string Title => ToolsL["fraction_calculator_title"];
    private string Description => ToolsL["fraction_calculator_lead"];
    private string InputLabel => L["fractions"];
    private string OperationLabel => L["operation"];
    private string ResultLabel => L["simplified_result"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_non_zero_denominators_and_a_valid"];
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
        _result = Blog.Blazor.Core.FractionCalculator.Calculate(
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
