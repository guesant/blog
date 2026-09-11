using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class CompoundInterest
{
    private string CanonicalPath => RequestPath;
    private string _principalText = "1000";
    private string _rateText = "10";
    private string _periodsText = "2";
    private string _contributionText = "100";
    private CompoundInterestResult _result = CompoundInterestCalculator.Solve(1000, 10, 2, 100);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "principal")]
    private string? QueryPrincipal { get; set; }

    [SupplyParameterFromQuery(Name = "rate")]
    private string? QueryRate { get; set; }

    [SupplyParameterFromQuery(Name = "periods")]
    private string? QueryPeriods { get; set; }

    [SupplyParameterFromQuery(Name = "contribution")]
    private string? QueryContribution { get; set; }
    private string Action => L["tools_compound_interest"];
    private string Title => ToolsL["compound_interest_page_title"];
    private string Description => ToolsL["compound_interest_lead"];
    private string InputLabel => L["parameters"];
    private string PrincipalLabel => L["principal"];
    private string RateLabel => L["rate_per_period"];
    private string PeriodsLabel => L["periods"];
    private string ContributionLabel => L["contribution_per_period"];
    private string SubmitLabel => L["calculate"];
    private string FutureValueLabel => L["future_value"];
    private string ContributedLabel => L["total_contributed"];
    private string InterestLabel => L["interest_earned"];
    private string ErrorMessage =>
        Result.Error == CompoundInterestError.LimitExceeded
            ? (L["use_between_1_and_10000_periods"])
            : (L["provide_valid_values_the_rate_must_be_greater"]);
    private string PrincipalText
    {
        get => _principalText;
        set
        {
            _principalText = value;
            Recalculate();
        }
    }
    private string RateText
    {
        get => _rateText;
        set
        {
            _rateText = value;
            Recalculate();
        }
    }
    private string PeriodsText
    {
        get => _periodsText;
        set
        {
            _periodsText = value;
            Recalculate();
        }
    }
    private string ContributionText
    {
        get => _contributionText;
        set
        {
            _contributionText = value;
            Recalculate();
        }
    }
    private CompoundInterestResult Result => _result;

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            _principalText = QueryPrincipal ?? _principalText;
            _rateText = QueryRate ?? _rateText;
            _periodsText = QueryPeriods ?? _periodsText;
            _contributionText = QueryContribution ?? _contributionText;
            Recalculate();
            _queryInitialized = true;
        }
    }

    private void HandleSubmit() => Recalculate();

    private void Recalculate() =>
        _result = CompoundInterestCalculator.Solve(
            Parse(_principalText),
            Parse(_rateText),
            ParseInt(_periodsText),
            Parse(_contributionText)
        );

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;

    private static int ParseInt(string value) =>
        int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var result)
            ? result
            : 0;

    private static string Money(double value) => value.ToString("N2", CultureInfo.InvariantCulture);
}
