using System.Numerics;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Combinatorics
{
    private string CanonicalPath => RequestPath;
    private string _nText = "5";
    private string _rText = "2";
    private CombinatoricsResult _result = CombinatoricsCalculator.Calculate(5, 2);
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "n")]
    private string? QueryN { get; set; }

    [SupplyParameterFromQuery(Name = "r")]
    private string? QueryR { get; set; }
    private string Action => L["legacy_ddd25a990b88"];
    private string Title => L["legacy_e6ea4abc6fa9"];
    private string Description => L["legacy_f5e7f543966d"];
    private string InputLabel => L["legacy_67f93fb28065"];
    private string SubmitLabel => L["legacy_37565a968d31"];
    private string ErrorLabel => L["legacy_a6b892708533"];
    private string NText
    {
        get => _nText;
        set
        {
            _nText = value;
            Recalculate();
        }
    }
    private string RText
    {
        get => _rText;
        set
        {
            _rText = value;
            Recalculate();
        }
    }
    private CombinatoricsResult Result => _result;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _nText = QueryN ?? _nText;
        _rText = QueryR ?? _rText;
        Recalculate();
        _queryInitialized = true;
    }

    private void Calculate() => Recalculate();

    private void Recalculate() =>
        _result = CombinatoricsCalculator.Calculate(Parse(_nText), Parse(_rText));

    private static int Parse(string value) => int.TryParse(value, out var result) ? result : -1;
}
