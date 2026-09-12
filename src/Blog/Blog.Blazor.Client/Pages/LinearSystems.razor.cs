using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class LinearSystems
{
    private string CanonicalPath => RequestPath;
    private readonly string[,] _coefficients =
    {
        { "2", "1", "0" },
        { "1", "-1", "0" },
        { "0", "0", "1" },
    };
    private readonly string[] _constants = ["7", "1", "0"];
    private string _sizeText = "2";
    private LinearSystemResult _result = LinearSystemCalculator.Solve(
        new[,]
        {
            { 2d, 1d },
            { 1d, -1d },
        },
        [7, 1]
    );
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "size")]
    private string? QuerySize { get; set; }

    [SupplyParameterFromQuery(Name = "a11")]
    private string? QueryA11 { get; set; }

    [SupplyParameterFromQuery(Name = "a12")]
    private string? QueryA12 { get; set; }

    [SupplyParameterFromQuery(Name = "a13")]
    private string? QueryA13 { get; set; }

    [SupplyParameterFromQuery(Name = "a21")]
    private string? QueryA21 { get; set; }

    [SupplyParameterFromQuery(Name = "a22")]
    private string? QueryA22 { get; set; }

    [SupplyParameterFromQuery(Name = "a23")]
    private string? QueryA23 { get; set; }

    [SupplyParameterFromQuery(Name = "a31")]
    private string? QueryA31 { get; set; }

    [SupplyParameterFromQuery(Name = "a32")]
    private string? QueryA32 { get; set; }

    [SupplyParameterFromQuery(Name = "a33")]
    private string? QueryA33 { get; set; }

    [SupplyParameterFromQuery(Name = "b1")]
    private string? QueryB1 { get; set; }

    [SupplyParameterFromQuery(Name = "b2")]
    private string? QueryB2 { get; set; }

    [SupplyParameterFromQuery(Name = "b3")]
    private string? QueryB3 { get; set; }
    private string Slug => RequestRouteSegment("linear-systems");
    private bool IsCombined => Slug == "linear-systems";
    private int SystemSize =>
        IsCombined
            ? (int.TryParse(_sizeText, out var size) && size == 3 ? 3 : 2)
            : (Slug == "linear-system-3x3" ? 3 : 2);
    private string Action => LocalizedUrls.Current($"/tools/{Slug}");
    private string Title =>
        Slug switch
        {
            "linear-system-2x2" => ToolsL["linear_system_2x2_title"],
            "linear-system-3x3" => ToolsL["linear_system_3x3_title"],
            _ => L["linear_systems"],
        };
    private string Description =>
        Slug switch
        {
            "linear-system-2x2" => ToolsL["linear_system_2x2_lead"],
            "linear-system-3x3" => ToolsL["linear_system_3x3_lead"],
            _ => L["linear_systems"],
        };
    private string InputLabel => L["solve_2x2_and_3x3_systems_with_gaussian"];
    private string SizeLabel => L["augmented_matrix"];
    private string SubmitLabel => L["dimension"];
    private string ErrorLabel => L["solve"];

    private string RowLabel(int row) => L["row_label", row];

    private string SizeText
    {
        get => _sizeText;
        set
        {
            _sizeText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }
    private static IReadOnlyList<SiteSelectOption> SizeOptions =>
        [new("2", "2 × 2"), new("3", "3 × 3")];

    private string GetCoefficient(int row, int column) => _coefficients[row, column];

    private string GetConstant(int row) => _constants[row];

    private static string CoefficientName(int row, int column) => $"a{row + 1}{column + 1}";

    private void SetCoefficient(int row, int column, string value)
    {
        _coefficients[row, column] = value;
        _debouncer.Trigger(() =>
        {
            Recalculate();
            StateHasChanged();
        });
    }

    private void SetConstant(int row, string value)
    {
        _constants[row] = value;
        _debouncer.Trigger(() =>
        {
            Recalculate();
            StateHasChanged();
        });
    }

    private LinearSystemResult Result => _result;
    private string ChartLabel => L["linear_system_chart_label"];
    private string Equation1Label => L["linear_system_equation_1_series"];
    private string Equation2Label => L["linear_system_equation_2_series"];

    private IReadOnlyList<(double X, double Y)> LineFor(double a, double b, double c)
    {
        var xRadius = Math.Max(
            4,
            Math.Abs(Result.Solution.Length > 0 ? Result.Solution[0] : 0) + 3
        );
        var points = new List<(double, double)>(81);
        if (b == 0)
        {
            return points;
        }

        for (var index = 0; index <= 80; index++)
        {
            var x = -xRadius + (2 * xRadius * index / 80);
            var y = (c - (a * x)) / b;
            if (double.IsFinite(y))
            {
                points.Add((x, y));
            }
        }

        return points;
    }

    private IReadOnlyList<(double X, double Y)> Equation1Points =>
        LineFor(Parse(_coefficients[0, 0]), Parse(_coefficients[0, 1]), Parse(_constants[0]));
    private IReadOnlyList<(double X, double Y)> Equation2Points =>
        LineFor(Parse(_coefficients[1, 0]), Parse(_coefficients[1, 1]), Parse(_constants[1]));

    private SiteChartConfig ChartConfig =>
        new()
        {
            Type = SiteChartType.Line,
            Data = new SiteChartData
            {
                Labels = Equation1Points.Select(point => Format(point.X)).ToList(),
                Datasets =
                [
                    new SiteLineDataset
                    {
                        Label = Equation1Label,
                        Data = Equation1Points.Select(point => (object)point.Y).ToList(),
                    },
                    new SiteLineDataset
                    {
                        Label = Equation2Label,
                        Data = Equation2Points.Select(point => (object)point.Y).ToList(),
                    },
                ],
            },
        };

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QuerySize is null && !IsCombined)
        {
            _sizeText = SystemSize.ToString(CultureInfo.InvariantCulture);
            if (SystemSize == 2)
            {
                _coefficients[0, 0] = "1";
                _coefficients[0, 1] = "1";
                _constants[0] = "5";
                _coefficients[1, 0] = "1";
                _coefficients[1, 1] = "-1";
                _constants[1] = "1";
            }
            else
            {
                _coefficients[0, 0] = "1";
                _coefficients[0, 1] = "0";
                _coefficients[0, 2] = "0";
                _constants[0] = "1";
                _coefficients[1, 0] = "0";
                _coefficients[1, 1] = "1";
                _coefficients[1, 2] = "0";
                _constants[1] = "2";
                _coefficients[2, 0] = "0";
                _coefficients[2, 1] = "0";
                _coefficients[2, 2] = "1";
                _constants[2] = "3";
            }
        }
        _sizeText = QuerySize ?? _sizeText;
        var values = new[]
        {
            QueryA11,
            QueryA12,
            QueryA13,
            QueryA21,
            QueryA22,
            QueryA23,
            QueryA31,
            QueryA32,
            QueryA33,
        };
        for (var index = 0; index < values.Length; index++)
            if (values[index] is not null)
                _coefficients[index / 3, index % 3] = values[index]!;
        var constants = new[] { QueryB1, QueryB2, QueryB3 };
        for (var index = 0; index < constants.Length; index++)
            if (constants[index] is not null)
                _constants[index] = constants[index]!;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate()
    {
        var size = SystemSize;
        var matrix = new double[size, size];
        var constants = new double[size];
        for (var row = 0; row < size; row++)
        {
            constants[row] = Parse(_constants[row]);
            for (var column = 0; column < size; column++)
                matrix[row, column] = Parse(_coefficients[row, column]);
        }
        _result = LinearSystemCalculator.Solve(matrix, constants);
    }

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Format(double value) =>
        value.ToString("G12", CultureInfo.InvariantCulture);

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
