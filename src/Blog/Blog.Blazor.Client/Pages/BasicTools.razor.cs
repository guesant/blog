using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class BasicTools
{
    private string CanonicalPath => RequestPath;
    private string Slug => RequestRouteSegment("age-calculator");
    private string Action => LocalizedUrls.Current($"/tools/{Slug}");
    private string Title =>
        Slug switch
        {
            "age-calculator" => ToolsL["age_calculator_title"],
            "bmi-calculator" => ToolsL["bmi_calculator_title"],
            _ => L["date_difference_calculator"],
        };
    private string Description => ToolsL["age_calculator_lead"];
    private string InputLabel => L["input_values"];
    private string BirthLabel => L["date_of_birth"];
    private string WeightLabel => L["weight_kg"];
    private string HeightLabel => L["height_cm"];
    private string StartLabel => L["start_date"];
    private string EndLabel => L["end_date"];
    private string SubmitLabel => L["calculate"];
    private string ResultLabel => L["result"];
    private string YearsLabel => L["years"];
    private string MonthsLabel => L["months"];
    private string DaysLabel => L["days"];
    private string TotalDaysLabel => L["total_days"];
    private string InvalidDateLabel => L["enter_two_valid_dates_to_calculate_the"];
    private string DateOrderNote => L["the_start_date_is_after_the_end_date_showing"];
    private string BirthText { get; set; } = "2000-01-01";
    private string WeightText { get; set; } = "70";
    private string HeightText { get; set; } = "175";
    private string StartText { get; set; } = "2020-01-01";
    private string EndText { get; set; } = "2025-01-01";

    [SupplyParameterFromQuery(Name = "birth")]
    private string? QueryBirth { get; set; }

    [SupplyParameterFromQuery(Name = "weight")]
    private string? QueryWeight { get; set; }

    [SupplyParameterFromQuery(Name = "height")]
    private string? QueryHeight { get; set; }

    [SupplyParameterFromQuery(Name = "start")]
    private string? QueryStart { get; set; }

    [SupplyParameterFromQuery(Name = "end")]
    private string? QueryEnd { get; set; }
    private AgeResult Age { get; set; } =
        AgeCalculator.Calculate(new DateOnly(2000, 1, 1), DateOnly.FromDateTime(DateTime.Today));
    private BmiResult Bmi { get; set; } = BmiCalculator.Calculate(70, 175);
    private DateDifferenceResult DateDifference { get; set; } =
        DateDifferenceCalculator.Calculate(new DateOnly(2020, 1, 1), new DateOnly(2025, 1, 1));

    protected override void OnParametersSet()
    {
        BirthText = QueryBirth ?? BirthText;
        WeightText = QueryWeight ?? WeightText;
        HeightText = QueryHeight ?? HeightText;
        StartText = QueryStart ?? StartText;
        EndText = QueryEnd ?? EndText;
        Calculate();
    }

    private void Calculate()
    {
        if (Slug == "age-calculator" && DateOnly.TryParse(BirthText, out var birth))
            Age = AgeCalculator.Calculate(birth, DateOnly.FromDateTime(DateTime.Today));
        else if (Slug == "bmi-calculator")
            Bmi = BmiCalculator.Calculate(Parse(WeightText), Parse(HeightText));
        else
            DateDifference = DateDifferenceCalculator.Calculate(
                DateOnly.TryParse(StartText, out var start) ? start : null,
                DateOnly.TryParse(EndText, out var end) ? end : null
            );
    }

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;
}
