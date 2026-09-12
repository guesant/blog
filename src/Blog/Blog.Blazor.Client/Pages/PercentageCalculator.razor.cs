using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class PercentageCalculator
{
    private string CanonicalPath => RequestPath;
    private string _ofXText = "15";
    private string _ofYText = "100";
    private string _whatPctXText = "30";
    private string _whatPctYText = "150";
    private string _ofWhatXText = "30";
    private string _ofWhatYText = "20";
    private string _changeFromText = "80";
    private string _changeToText = "100";
    private PercentageResult _ofResult = Blog.Blazor.Core.PercentageCalculator.Calculate(100, 15);
    private PercentageWhatPercentResult _whatPctResult =
        Blog.Blazor.Core.PercentageCalculator.WhatPercentOf(30, 150);
    private PercentageOfWhatResult _ofWhatResult = Blog.Blazor.Core.PercentageCalculator.OfWhat(
        30,
        20
    );
    private PercentageChangeResult _changeResult = Blog.Blazor.Core.PercentageCalculator.Change(
        80,
        100
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "of_x")]
    private string? QueryOfX { get; set; }

    [SupplyParameterFromQuery(Name = "of_y")]
    private string? QueryOfY { get; set; }

    [SupplyParameterFromQuery(Name = "wp_x")]
    private string? QueryWhatPctX { get; set; }

    [SupplyParameterFromQuery(Name = "wp_y")]
    private string? QueryWhatPctY { get; set; }

    [SupplyParameterFromQuery(Name = "ow_x")]
    private string? QueryOfWhatX { get; set; }

    [SupplyParameterFromQuery(Name = "ow_y")]
    private string? QueryOfWhatY { get; set; }

    [SupplyParameterFromQuery(Name = "ch_from")]
    private string? QueryChangeFrom { get; set; }

    [SupplyParameterFromQuery(Name = "ch_to")]
    private string? QueryChangeTo { get; set; }

    private string Action => L["tools_percentage_calculator"];
    private string Title => ToolsL["percentage_calculator_title"];
    private string Description => ToolsL["percentage_calculator_lead"];
    private string InputLabel => L["values"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["provide_valid_numeric_values"];
    private string DivisionByZeroLabel => L["percentage_division_by_zero"];

    private string OfTitle => L["percentage_of_title"];
    private string OfXLabel => L["percentage_of_x_label"];
    private string OfYLabel => L["percentage_of_y_label"];
    private string WhatPctTitle => L["percentage_what_pct_title"];
    private string WhatPctXLabel => L["percentage_what_pct_x_label"];
    private string WhatPctYLabel => L["percentage_what_pct_y_label"];
    private string OfWhatTitle => L["percentage_of_what_title"];
    private string OfWhatXLabel => L["percentage_of_what_x_label"];
    private string OfWhatYLabel => L["percentage_of_what_y_label"];
    private string ChangeTitle => L["percentage_change_title"];
    private string ChangeFromLabel => L["percentage_change_from_label"];
    private string ChangeToLabel => L["percentage_change_to_label"];
    private string IncreaseLabel => L["percentage_change_increase"];
    private string DecreaseLabel => L["percentage_change_decrease"];

    private string OfXText
    {
        get => _ofXText;
        set
        {
            _ofXText = value;
            Recalculate();
        }
    }
    private string OfYText
    {
        get => _ofYText;
        set
        {
            _ofYText = value;
            Recalculate();
        }
    }
    private string WhatPctXText
    {
        get => _whatPctXText;
        set
        {
            _whatPctXText = value;
            Recalculate();
        }
    }
    private string WhatPctYText
    {
        get => _whatPctYText;
        set
        {
            _whatPctYText = value;
            Recalculate();
        }
    }
    private string OfWhatXText
    {
        get => _ofWhatXText;
        set
        {
            _ofWhatXText = value;
            Recalculate();
        }
    }
    private string OfWhatYText
    {
        get => _ofWhatYText;
        set
        {
            _ofWhatYText = value;
            Recalculate();
        }
    }
    private string ChangeFromText
    {
        get => _changeFromText;
        set
        {
            _changeFromText = value;
            Recalculate();
        }
    }
    private string ChangeToText
    {
        get => _changeToText;
        set
        {
            _changeToText = value;
            Recalculate();
        }
    }

    private PercentageResult OfResult => _ofResult;
    private PercentageWhatPercentResult WhatPctResult => _whatPctResult;
    private PercentageOfWhatResult OfWhatResult => _ofWhatResult;
    private PercentageChangeResult ChangeResult => _changeResult;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _ofXText = QueryOfX ?? _ofXText;
            _ofYText = QueryOfY ?? _ofYText;
            _whatPctXText = QueryWhatPctX ?? _whatPctXText;
            _whatPctYText = QueryWhatPctY ?? _whatPctYText;
            _ofWhatXText = QueryOfWhatX ?? _ofWhatXText;
            _ofWhatYText = QueryOfWhatY ?? _ofWhatYText;
            _changeFromText = QueryChangeFrom ?? _changeFromText;
            _changeToText = QueryChangeTo ?? _changeToText;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate()
    {
        _ofResult = Blog.Blazor.Core.PercentageCalculator.Calculate(
            Parse(_ofYText),
            Parse(_ofXText)
        );
        _whatPctResult = Blog.Blazor.Core.PercentageCalculator.WhatPercentOf(
            Parse(_whatPctXText),
            Parse(_whatPctYText)
        );
        _ofWhatResult = Blog.Blazor.Core.PercentageCalculator.OfWhat(
            Parse(_ofWhatXText),
            Parse(_ofWhatYText)
        );
        _changeResult = Blog.Blazor.Core.PercentageCalculator.Change(
            Parse(_changeFromText),
            Parse(_changeToText)
        );
    }

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static string Format(double value) =>
        value.ToString("G12", CultureInfo.InvariantCulture);

    private string FormatOf(string x, string y, double result) =>
        $"{Format(Parse(x))}% {OfYLabel.ToLowerInvariant()} {Format(Parse(y))} = {Format(result)}";

    private static string FormatWhatPct(PercentageWhatPercentResult result) =>
        $"{Format(result.X)} = {Format(result.Percentage)}% ({Format(result.Y)})";

    private string FormatOfWhat(PercentageOfWhatResult result) =>
        $"{Format(result.X)} = {Format(result.Y)}% {OfYLabel.ToLowerInvariant()} {Format(result.Whole)}";

    private string FormatChange(PercentageChangeResult result) =>
        $"{Format(Math.Abs(result.DeltaPercent))}% {(result.IsIncrease ? IncreaseLabel : DecreaseLabel)} ({Format(result.From)} → {Format(result.To)})";
}
