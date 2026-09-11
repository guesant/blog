using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class MatrixCalculator
{
    private string CanonicalPath => RequestPath;
    private string _matrixText = "1,2\n3,4";
    private string _operation = "determinant";
    private MatrixCalculationResult _result = Portfolio.Blazor.Core.MatrixCalculator.Calculate(
        "1,2\n3,4",
        "determinant"
    );
    private bool _queryInitialized;
    private bool _matrixTablePending;

    [SupplyParameterFromQuery(Name = "matrix")]
    private string? QueryMatrix { get; set; }

    [SupplyParameterFromQuery(Name = "operation")]
    private string? QueryOperation { get; set; }
    private string Action => L["legacy_387c6a2e386c"];
    private string Title => ToolsL["matrix_calculator_title"];
    private string Description => ToolsL["matrix_calculator_lead"];
    private string InputLabel => L["legacy_73e8b20eaca1"];
    private string OperationLabel => L["legacy_bcb0412df16b"];
    private string DeterminantLabel => L["legacy_1494ea6c1f6b"];
    private string TransposeLabel => L["legacy_f586c4ea5bae"];
    private string InverseLabel => L["legacy_ff3e7e4b8a5f"];
    private string ResultLabel => L["legacy_7aa9296397b6"];
    private string MatrixTableId => L["legacy_a57b42f7e22c"];
    private string MatrixChartId => L["legacy_25d6cfd9aac3"];
    private string SubmitLabel => L["legacy_53519f340509"];
    private string ErrorLabel => L["legacy_b57334988f83"];
    private string MatrixText
    {
        get => _matrixText;
        set
        {
            _matrixText = value;
            Recalculate();
        }
    }
    private string Operation
    {
        get => _operation;
        set
        {
            _operation = value;
            Recalculate();
        }
    }
    private IReadOnlyList<SiteSelectOption> OperationOptions =>
        [
            new("determinant", DeterminantLabel),
            new("transpose", TransposeLabel),
            new("inverse", InverseLabel),
        ];
    private MatrixCalculationResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _matrixText = QueryMatrix ?? _matrixText;
        _operation = QueryOperation ?? _operation;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate()
    {
        _result = Portfolio.Blazor.Core.MatrixCalculator.Calculate(_matrixText, _operation);
        _matrixTablePending = true;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (
            RendererInfo.IsInteractive
            && _matrixTablePending
            && Result.IsValid
            && !Result.Scalar.HasValue
        )
        {
            _matrixTablePending = false;
            var rows = Result.Matrix.Select(row => row.Select(Format).ToArray()).ToArray();
            var headers = Enumerable
                .Range(0, rows.Length)
                .Select(index => $"x{index + 1}")
                .ToArray();
            await JS.InvokeVoidAsync(
                "tableEditor.initializeTabulator",
                MatrixTableId,
                headers,
                rows
            );
            await JS.InvokeVoidAsync("echartsTools.initializeMatrix", MatrixChartId, Result.Matrix);
        }
    }

    private static string Format(double value) =>
        value.ToString("G8", CultureInfo.InvariantCulture);
}
