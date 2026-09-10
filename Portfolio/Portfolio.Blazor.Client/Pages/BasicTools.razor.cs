using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class BasicTools
{
    private string CanonicalPath => RequestPath;
    private string Slug => RequestRouteSegment("age-calculator");
    private string Action => LocalizedUrls.Current($"/tools/{Slug}");
    private string Title =>
        Slug switch
        {
            "age-calculator" => L["legacy_526a44980e7e"],
            "bmi-calculator" => L["legacy_086e8206e0b9"],
            _ => L["legacy_37ed61333496"],
        };
    private string Description => L["legacy_235020da38aa"];
    private string InputLabel => L["legacy_67f93fb28065"];
    private string BirthLabel => L["legacy_754004108abf"];
    private string WeightLabel => L["legacy_dee1e3505827"];
    private string HeightLabel => L["legacy_c2084c7ec998"];
    private string StartLabel => L["legacy_5249e43de046"];
    private string EndLabel => L["legacy_fa7de690f78a"];
    private string SubmitLabel => L["legacy_37565a968d31"];
    private string ResultLabel => L["legacy_d9b2a61fb8b3"];
    private string YearsLabel => L["legacy_1bb0f541030b"];
    private string MonthsLabel => L["legacy_2ec786b77a14"];
    private string DaysLabel => L["legacy_8bbe81cc5b24"];
    private string TotalDaysLabel => L["legacy_0e774c4fd56e"];
    private string InvalidDateLabel => L["legacy_606687da80eb"];
    private string DateOrderNote => L["legacy_981f71c7e428"];
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
