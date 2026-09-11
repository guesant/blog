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
    private string Action => L["tools_combinatorics"];
    private string Title => ToolsL["combinatorics_title"];
    private string Description => ToolsL["combinatorics_lead"];
    private string InputLabel => L["input_values"];
    private string SubmitLabel => L["calculate"];
    private string ErrorLabel => L["use_0_r_n_500"];
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
