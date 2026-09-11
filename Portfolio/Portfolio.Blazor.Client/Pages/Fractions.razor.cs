using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Fractions
{
    private string CanonicalPath => RequestPath;
    private string _firstText = "1/2",
        _secondText = "1/6",
        _operationText = "+";
    private FractionResult _result = Portfolio.Blazor.Core.FractionCalculator.Calculate(
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
    private string Action => L["legacy_b2a9e5d206d2"];
    private string Title => ToolsL["fractions_title"];
    private string Description => ToolsL["fractions_lead"];
    private string InputLabel => L["legacy_cf8b4a6ab201"];
    private string FirstLabel => L["legacy_07724ee75734"];
    private string SecondLabel => L["legacy_98a24d1219f9"];
    private string OperationLabel => L["legacy_bcb0412df16b"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string ResultLabel => L["legacy_f99cb3950d4d"];
    private string ErrorLabel => L["legacy_aef69f874711"];
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
        _result = Portfolio.Blazor.Core.FractionCalculator.Calculate(
            _firstText,
            _operationText.FirstOrDefault(),
            _secondText
        );
}
