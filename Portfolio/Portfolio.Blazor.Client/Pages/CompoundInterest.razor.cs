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
    private string Action => L["legacy_037d63ab9743"];
    private string Title => ToolsL["compound_interest_page_title"];
    private string Description => ToolsL["compound_interest_lead"];
    private string InputLabel => L["legacy_5b6220fefc5c"];
    private string PrincipalLabel => L["legacy_e52598d26d1a"];
    private string RateLabel => L["legacy_6825c2556498"];
    private string PeriodsLabel => L["legacy_864f1bcc7b1e"];
    private string ContributionLabel => L["legacy_a1209edf42d6"];
    private string SubmitLabel => L["legacy_37565a968d31"];
    private string FutureValueLabel => L["legacy_b3970297edb8"];
    private string ContributedLabel => L["legacy_c31eb213616f"];
    private string InterestLabel => L["legacy_e0ede7ec1dee"];
    private string ErrorMessage =>
        Result.Error == CompoundInterestError.LimitExceeded
            ? (L["legacy_8141805028c6"])
            : (L["legacy_adfd99b7f994"]);
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
