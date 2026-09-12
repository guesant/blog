using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class ComplexNumberCalculator
{
    private string CanonicalPath => RequestPath;
    private string _firstText = "3+4i",
        _secondText = "1-2i",
        _operationText = "add";
    private ComplexCalculationResult _result = Blog.Blazor.Core.ComplexNumberCalculator.Calculate(
        "3+4i",
        "1-2i",
        "add"
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "first")]
    private string? QueryFirst { get; set; }

    [SupplyParameterFromQuery(Name = "second")]
    private string? QuerySecond { get; set; }

    [SupplyParameterFromQuery(Name = "operation")]
    private string? QueryOperation { get; set; }
    private string Action => L["tools_complex_number_calculator"];
    private string Title => ToolsL["complex_number_calculator_title"];
    private string Description => ToolsL["complex_number_calculator_lead"];
    private string Note => L["use_forms_such_as_3_4i_3_4i_or_a_real_number"];
    private string InputLabel => L["complex_numbers"];
    private string OperationLabel => L["operation"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_valid_complex_numbers_division_by_zero"];
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
        _result = Blog.Blazor.Core.ComplexNumberCalculator.Calculate(
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
