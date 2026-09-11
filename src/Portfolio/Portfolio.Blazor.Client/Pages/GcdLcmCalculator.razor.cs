using System.Numerics;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class GcdLcmCalculator
{
    private string CanonicalPath => RequestPath;
    private List<string> _numbers = ["48", "18"];
    private GcdLcmListResult _result = Portfolio.Blazor.Core.GcdLcmCalculator.Calculate(
        new BigInteger[] { 48, 18 }
    );
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "numbers")]
    private string[]? QueryNumbers { get; set; }

    [SupplyParameterFromQuery(Name = "count")]
    private int? QueryCount { get; set; }

    private string Action => L["tools_gcd_lcm_calculator"];
    private string Title => ToolsL["gcd_lcm_calculator_title"];
    private string Description => ToolsL["gcd_lcm_calculator_lead"];
    private string InputLabel => L["numbers"];
    private string NumbersLabel => L["numbers"];
    private string CountLabel => L["numbers"];
    private string GcdLabel => L["gcd"];
    private string LcmLabel => L["lcm"];
    private string SubmitLabel => L["calculate"];
    private string AddLabel => L["gcd_lcm_add_label"];
    private string RemoveLabel => L["gcd_lcm_remove_label"];
    private string InvalidLabel => L["enter_positive_whole_numbers_only"];

    private List<string> Numbers => _numbers;
    private GcdLcmListResult Result => _result;

    private string GetNumber(int index) =>
        index >= 0 && index < _numbers.Count ? _numbers[index] : string.Empty;

    private void SetNumber(int index, string value)
    {
        if (index < 0)
        {
            return;
        }

        while (_numbers.Count <= index)
        {
            _numbers.Add(string.Empty);
        }

        _numbers[index] = value;
        Recalculate();
    }

    private void AddRow()
    {
        _numbers.Add(string.Empty);
        Recalculate();
    }

    private void RemoveRow(int index)
    {
        if (_numbers.Count <= 1 || index < 0 || index >= _numbers.Count)
        {
            return;
        }

        _numbers.RemoveAt(index);
        Recalculate();
    }

    protected override void OnParametersSet()
    {
        if (!_queryInitialized)
        {
            if (QueryNumbers is { Length: > 0 })
            {
                _numbers = QueryNumbers.ToList();
            }
            else if (QueryCount is > 0 and var count)
            {
                _numbers = [.. Enumerable.Repeat(string.Empty, count)];
            }

            Recalculate();
            _queryInitialized = true;
        }
    }

    private void Recalculate()
    {
        var raw = _numbers.Select(number => number.Trim()).ToList();
        if (raw.Count == 0 || raw.Any(string.IsNullOrEmpty))
        {
            _result = new GcdLcmListResult(false, 0, 0, GcdLcmError.None);
            return;
        }

        var numbers = new List<BigInteger>();
        foreach (var value in raw)
        {
            if (
                !BigInteger.TryParse(
                    value,
                    NumberStyles.Integer,
                    CultureInfo.InvariantCulture,
                    out var number
                )
                || number <= 0
            )
            {
                _result = new GcdLcmListResult(false, 0, 0, GcdLcmError.InvalidInput);
                return;
            }

            numbers.Add(number);
        }

        _result = Portfolio.Blazor.Core.GcdLcmCalculator.Calculate(numbers);
    }
}
