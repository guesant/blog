using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class RandomDateGenerator
{
    private string CanonicalPath => RequestPath;
    private string _fromText = DateTime
            .UtcNow.AddYears(-1)
            .ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
        _toText = DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
        _countText = "1";
    private DateTime FromDate = DateTime.UtcNow.AddYears(-1),
        ToDate = DateTime.UtcNow;
    private bool _includeTime,
        _queryInitialized;
    private RandomDateResult _result = RandomNumberTools.GenerateDates(
        DateTime.UtcNow.AddYears(-1),
        DateTime.UtcNow,
        1,
        false
    );

    [SupplyParameterFromQuery(Name = "from")]
    private string? QueryFrom { get; set; }

    [SupplyParameterFromQuery(Name = "to")]
    private string? QueryTo { get; set; }

    [SupplyParameterFromQuery(Name = "count")]
    private int? QueryCount { get; set; }

    [SupplyParameterFromQuery(Name = "time")]
    private bool? QueryTime { get; set; }
    private string Action => L["tools_random_date_generator"];
    private string Title => ToolsL["random_date_generator_title"];
    private string Description => ToolsL["random_date_generator_lead"];
    private string InputLabel => L["parameters"];
    private string FromLabel => L["from"];
    private string ToLabel => L["to_range"];
    private string CountLabel => L["how_many_alt"];
    private string IncludeTimeLabel => L["include_time"];
    private string GenerateLabel => L["generate"];
    private string ResultLabel => L["results"];
    private string ErrorLabel => L["enter_a_valid_date_range"];
    private string FromText
    {
        get => _fromText;
        set => _fromText = value;
    }
    private string ToText
    {
        get => _toText;
        set => _toText = value;
    }
    private string CountText
    {
        get => _countText;
        set => _countText = value;
    }
    private bool IncludeTime
    {
        get => _includeTime;
        set => _includeTime = value;
    }
    private RandomDateResult Result => _result;
    private DateOnly? FromDateOnly
    {
        get => DateOnly.FromDateTime(FromDate);
        set => FromDate = (value ?? DateOnly.FromDateTime(FromDate)).ToDateTime(TimeOnly.MinValue);
    }
    private DateOnly? ToDateOnly
    {
        get => DateOnly.FromDateTime(ToDate);
        set => ToDate = (value ?? DateOnly.FromDateTime(ToDate)).ToDateTime(TimeOnly.MinValue);
    }

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _fromText = QueryFrom ?? _fromText;
        _toText = QueryTo ?? _toText;
        if (QueryCount.HasValue)
            _countText = QueryCount.Value.ToString(CultureInfo.InvariantCulture);
        _includeTime = QueryTime == true;
        if (
            DateTime.TryParseExact(
                _fromText,
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal,
                out var from
            )
        )
            FromDate = from.ToUniversalTime();
        if (
            DateTime.TryParseExact(
                _toText,
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal,
                out var to
            )
        )
            ToDate = to.ToUniversalTime();
        Generate();
        _queryInitialized = true;
    }

    private void Generate()
    {
        _result = RandomNumberTools.GenerateDates(
            FromDate.ToUniversalTime(),
            ToDate.ToUniversalTime().AddDays(_includeTime ? 1 : 0).AddTicks(-1),
            int.TryParse(_countText, out var count) ? count : 1,
            _includeTime
        );
    }
}
