using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class ComplexNumberCalculator
{
    private string CanonicalPath => RequestPath;
    private string _firstText = "3+4i",
        _secondText = "1-2i",
        _operationText = "add";
    private ComplexCalculationResult _result =
        Portfolio.Blazor.Core.ComplexNumberCalculator.Calculate("3+4i", "1-2i", "add");
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "first")]
    private string? QueryFirst { get; set; }

    [SupplyParameterFromQuery(Name = "second")]
    private string? QuerySecond { get; set; }

    [SupplyParameterFromQuery(Name = "operation")]
    private string? QueryOperation { get; set; }
    private string Action => L["legacy_d6ee3036ba77"];
    private string Title => L["legacy_c449c80b2b8f"];
    private string Description => L["legacy_36fdc49cd419"];
    private string Note => L["legacy_3d682cdddbc5"];
    private string InputLabel => L["legacy_6b9251521287"];
    private string OperationLabel => L["legacy_8092cabe63d1"];
    private string SubmitLabel => L["legacy_37565a968d31"];
    private string ErrorLabel => L["legacy_7382c654743c"];
    private string FirstText
    {
        get => _firstText;
        set
        {
            _firstText = value;
            Recalculate();
        }
    }
    private string SecondText
    {
        get => _secondText;
        set
        {
            _secondText = value;
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
    private ComplexCalculationResult Result => _result;
    private static IReadOnlyList<SiteSelectOption> OperationOptions =>
        [new("add", "+"), new("subtract", "−"), new("multiply", "×"), new("divide", "÷")];

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _firstText = QueryFirst ?? _firstText;
        _secondText = QuerySecond ?? _secondText;
        _operationText = QueryOperation ?? _operationText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = Portfolio.Blazor.Core.ComplexNumberCalculator.Calculate(
            _firstText,
            _secondText,
            _operationText
        );

    private static string Format(ComplexNumber value)
    {
        var sign = value.Imaginary < 0 ? " − " : " + ";
        return $"{value.Real.ToString("G8", CultureInfo.InvariantCulture)}{sign}{Math.Abs(value.Imaginary).ToString("G8", CultureInfo.InvariantCulture)}i";
    }

    private static string Format(double value) =>
        value.ToString("G8", CultureInfo.InvariantCulture);
}
