using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class QuadraticEquation
{
    private string CanonicalPath => RequestPath;
    private string _aText = "1";
    private string _bText = "-5";
    private string _cText = "6";
    private QuadraticEquationResult _result = QuadraticEquationSolver.Solve(1, -5, 6);
    private bool _queryInitialized;
    private readonly Debouncer _debouncer = new(TimeSpan.FromMilliseconds(300));

    [SupplyParameterFromQuery(Name = "a")]
    private string? QueryA { get; set; }

    [SupplyParameterFromQuery(Name = "b")]
    private string? QueryB { get; set; }

    [SupplyParameterFromQuery(Name = "c")]
    private string? QueryC { get; set; }
    private string Action => L["legacy_983f39df8e04"];
    private string Title => ToolsL["quadratic_equation_title"];
    private string Description => ToolsL["quadratic_equation_lead"];
    private string InputLabel => L["legacy_c6be4b29456c"];
    private string SubmitLabel => L["legacy_28b6f5bf458b"];
    private string ExplanationLabel => L["legacy_23470bef125e"];
    private string RootsLabel => L["legacy_bb2552fd4574"];
    private string ComplexRootsLabel => L["legacy_d2eb7657b4dd"];
    private string ErrorMessage =>
        Result.Error switch
        {
            QuadraticEquationError.NonFiniteInput => L["legacy_9e807fdb152e"],
            QuadraticEquationError.ZeroLeadingCoefficient => L["quadratic_zero_leading"],
            _ => L["legacy_150a37d19e71"],
        };
    private QuadraticEquationResult Result => _result;
    private string ChartLabel => L["quadratic_chart_label"];
    private string SeriesLabel => L["quadratic_series_label"];

    private IReadOnlyList<string> Steps
    {
        get
        {
            if (Result.HasRealRoots)
            {
                return
                [
                    L["quadratic_step_discriminant", Format(Result.Discriminant)],
                    L["quadratic_step_formula"],
                    L["quadratic_step_roots", Format(Result.Root1.Real), Format(Result.Root2.Real)],
                ];
            }

            return
            [
                L["quadratic_step_negative_discriminant", Format(Result.Discriminant)],
                L["quadratic_step_real_part", Format(Result.Root1.Real)],
                L["quadratic_step_imaginary_part", Format(Math.Abs(Result.Root1.Imaginary))],
            ];
        }
    }

    private IReadOnlyList<(double X, double Y)> ChartPoints
    {
        get
        {
            var a = Parse(_aText);
            var b = Parse(_bText);
            var c = Parse(_cText);
            var center = -b / (2 * a);
            var radius = Result.HasRealRoots
                ? Math.Max(3, Math.Abs(Result.Root1.Real - Result.Root2.Real) / 2 + 2)
                : 5;
            var points = new List<(double X, double Y)>(81);
            for (var index = 0; index <= 80; index++)
            {
                var x = center - radius + (2 * radius * index) / 80;
                points.Add((x, a * x * x + b * x + c));
            }

            return points;
        }
    }

    private SiteChartConfig ChartConfig =>
        new()
        {
            Type = SiteChartType.Line,
            Data = new SiteChartData
            {
                Labels = ChartPoints.Select(point => Format(point.X)).ToList(),
                Datasets =
                [
                    new SiteLineDataset
                    {
                        Label = SeriesLabel,
                        Data = ChartPoints.Select(point => (object)point.Y).ToList(),
                    },
                ],
            },
        };

    private string AText
    {
        get => _aText;
        set
        {
            _aText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }

    private string BText
    {
        get => _bText;
        set
        {
            _bText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }

    private string CText
    {
        get => _cText;
        set
        {
            _cText = value;
            _debouncer.Trigger(() =>
            {
                Recalculate();
                StateHasChanged();
            });
        }
    }

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _aText = QueryA ?? _aText;
            _bText = QueryB ?? _bText;
            _cText = QueryC ?? _cText;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate()
    {
        _result = QuadraticEquationSolver.Solve(Parse(_aText), Parse(_bText), Parse(_cText));
    }

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Format(double value) =>
        (value == 0 ? 0 : value).ToString("G12", CultureInfo.InvariantCulture);

    private static string FormatComplex(ComplexNumber value)
    {
        var sign = value.Imaginary < 0 ? "−" : "+";
        return $"{Format(value.Real)} {sign} {Format(Math.Abs(value.Imaginary))}i";
    }

    public void Dispose()
    {
        _debouncer.Dispose();
        GC.SuppressFinalize(this);
    }
}
