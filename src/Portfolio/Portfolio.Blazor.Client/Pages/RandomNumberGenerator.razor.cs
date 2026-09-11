using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class RandomNumberGenerator
{
    private string CanonicalPath => RequestPath;
    private string _minText = "1",
        _maxText = "100",
        _countText = "1",
        _mode = "integer";
    private bool _noDuplicates,
        _queryInitialized;
    private RandomNumberResult _result = RandomNumberTools.GenerateNumbers(
        1,
        100,
        1,
        "integer",
        false
    );

    [SupplyParameterFromQuery(Name = "min")]
    private double? QueryMin { get; set; }

    [SupplyParameterFromQuery(Name = "max")]
    private double? QueryMax { get; set; }

    [SupplyParameterFromQuery(Name = "count")]
    private int? QueryCount { get; set; }

    [SupplyParameterFromQuery(Name = "mode")]
    private string? QueryMode { get; set; }

    [SupplyParameterFromQuery(Name = "unique")]
    private bool? QueryUnique { get; set; }
    private string Action => L["legacy_8f56e914189c"];
    private string Title => ToolsL["random_number_generator_title"];
    private string Description => ToolsL["random_number_generator_lead"];
    private string InputLabel => L["legacy_d9825dc0fc2f"];
    private string MinLabel => L["legacy_5bf471e7b2f9"];
    private string MaxLabel => L["legacy_fee33d9f5fae"];
    private string CountLabel => L["legacy_ebfc81d5cecc"];
    private string ModeLabel => L["legacy_7c900961a252"];
    private string IntegerLabel => L["legacy_4bc3227bbd62"];
    private string DecimalLabel => L["legacy_226a493e1985"];
    private string NoDuplicatesLabel => L["legacy_7d663f92919b"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string ResultLabel => L["legacy_2f0452494fcb"];
    private string ErrorLabel => L["legacy_59d251025993"];
    private string MinText
    {
        get => _minText;
        set { _minText = value; }
    }
    private string MaxText
    {
        get => _maxText;
        set { _maxText = value; }
    }
    private string CountText
    {
        get => _countText;
        set { _countText = value; }
    }
    private string Mode
    {
        get => _mode;
        set { _mode = value; }
    }
    private bool NoDuplicates
    {
        get => _noDuplicates;
        set { _noDuplicates = value; }
    }
    private RandomNumberResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        if (QueryMin.HasValue)
            _minText = QueryMin.Value.ToString(CultureInfo.InvariantCulture);
        if (QueryMax.HasValue)
            _maxText = QueryMax.Value.ToString(CultureInfo.InvariantCulture);
        if (QueryCount.HasValue)
            _countText = QueryCount.Value.ToString(CultureInfo.InvariantCulture);
        if (QueryMode is "decimal")
            _mode = "decimal";
        _noDuplicates = QueryUnique == true;
        Generate();
        _queryInitialized = true;
    }

    private void SetInteger() => Mode = "integer";

    private void SetDecimal() => Mode = "decimal";

    private void Generate()
    {
        _result = RandomNumberTools.GenerateNumbers(
            Parse(_minText),
            Parse(_maxText),
            int.TryParse(_countText, out var count) ? count : 1,
            _mode,
            _noDuplicates && _mode == "integer"
        );
    }

    private static double Parse(string value) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result)
            ? result
            : double.NaN;
}
