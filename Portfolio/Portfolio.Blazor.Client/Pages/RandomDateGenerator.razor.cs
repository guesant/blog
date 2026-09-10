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
    private string Action => L["legacy_2b9d7b531f92"];
    private string Title => L["legacy_d9af1cf0c930"];
    private string Description => L["legacy_5c74b49a5a47"];
    private string InputLabel => L["legacy_d9825dc0fc2f"];
    private string FromLabel => L["legacy_1bcd30c56b1d"];
    private string ToLabel => L["legacy_b2bb2abf83d9"];
    private string CountLabel => L["legacy_c3c293af9e88"];
    private string IncludeTimeLabel => L["legacy_7417654bcf34"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string ResultLabel => L["legacy_2f0452494fcb"];
    private string ErrorLabel => L["legacy_49e60b7327a6"];
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
