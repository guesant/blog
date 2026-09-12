using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class Fractions
{
    private string CanonicalPath => RequestPath;
    private string _firstText = "1/2",
        _secondText = "1/6",
        _operationText = "+";
    private FractionResult _result = Blog.Blazor.Core.FractionCalculator.Calculate(
        "1/2",
        '+',
        "1/6"
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "first")]
    private string? QueryFirst { get; set; }

    [SupplyParameterFromQuery(Name = "second")]
    private string? QuerySecond { get; set; }

    [SupplyParameterFromQuery(Name = "operation")]
    private string? QueryOperation { get; set; }
    private string Action => L["tools_fractions"];
    private string Title => ToolsL["fractions_title"];
    private string Description => ToolsL["fractions_lead"];
    private string InputLabel => L["fractions"];
    private string FirstLabel => L["first_fraction"];
    private string SecondLabel => L["second_fraction"];
    private string OperationLabel => L["operation"];
    private string SubmitLabel => L["calculate"];
    private string ResultLabel => L["simplified_result"];
    private string ErrorLabel => L["use_fractions_as_a_b_and_a_valid_operation"];
    private static IReadOnlyList<SiteSelectOption> OperationOptions =>
        [new("+", "+"), new("-", "−"), new("*", "×"), new("/", "/")];
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
    private FractionResult Result => _result;

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
        _result = Blog.Blazor.Core.FractionCalculator.Calculate(
            _firstText,
            _operationText.FirstOrDefault(),
            _secondText
        );
}
