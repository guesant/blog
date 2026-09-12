using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class MatrixCalculator
{
    private string CanonicalPath => RequestPath;
    private string _matrixText = "1,2\n3,4";
    private string _operation = "determinant";
    private MatrixCalculationResult _result = Blog.Blazor.Core.MatrixCalculator.Calculate(
        "1,2\n3,4",
        "determinant"
    );
    private bool _queryInitialized;
    private bool _matrixTablePending;

    [SupplyParameterFromQuery(Name = "matrix")]
    private string? QueryMatrix { get; set; }

    [SupplyParameterFromQuery(Name = "operation")]
    private string? QueryOperation { get; set; }
    private string Action => L["tools_matrix_calculator"];
    private string Title => ToolsL["matrix_calculator_title"];
    private string Description => ToolsL["matrix_calculator_lead"];
    private string InputLabel => L["matrix_one_row_per_line"];
    private string OperationLabel => L["operation"];
    private string DeterminantLabel => L["determinant"];
    private string TransposeLabel => L["transpose"];
    private string InverseLabel => L["inverse"];
    private string ResultLabel => L["matrix_result"];
    private string MatrixTableId => L["matrix_result_pt"];
    private string MatrixChartId => L["matrix_chart_pt"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_a_valid_square_matrix_up_to_6_6_an"];
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
        _result = Blog.Blazor.Core.MatrixCalculator.Calculate(_matrixText, _operation);
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
