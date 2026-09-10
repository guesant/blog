using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class UnitConverter
{
    private string CanonicalPath => RequestPath;
    private string Category = "length",
        From = "m",
        To = "km";
    private double Value = 1;
    private bool initialized;
    private string Title => L["unit_converter_title"];
    private string Description => L["unit_converter_description"];
    private string ValueLabel => L["unit_value"];
    private string FromLabel => L["unit_from"];
    private string ToLabel => L["unit_to"];
    private IReadOnlyList<(string Id, string Label)> Categories =>
        [
            ("length", L["unit_length"]),
            ("weight", L["unit_weight"]),
            ("temperature", L["unit_temperature"]),
        ];
    private IReadOnlyList<(string Id, string Label)> Units =>
        Portfolio
            .Blazor.Core.UnitConverter.Units.Where(unit =>
                Category switch
                {
                    "length" => new[] { "mm", "cm", "m", "km", "in", "ft", "yd", "mi" }.Contains(
                        unit.Id
                    ),
                    "weight" => new[] { "mg", "g", "kg", "oz", "lb" }.Contains(unit.Id),
                    _ => new[] { "c", "f", "k" }.Contains(unit.Id),
                }
            )
            .ToArray();
    private IReadOnlyList<SiteSelectOption> UnitSelectOptions =>
        Units.Select(unit => new SiteSelectOption(unit.Id, unit.Label)).ToArray();
    private string ResultText
    {
        get
        {
            var result = Portfolio.Blazor.Core.UnitConverter.Convert(Value, From, To);
            return result.IsValid ? $"{Value} {From} = {result.Value:0.######} {To}" : string.Empty;
        }
    }

    private void SelectCategory(string category)
    {
        Category = category;
        From = Units[0].Id;
        To = Units.Count > 1 ? Units[1].Id : Units[0].Id;
    }

    protected override void OnParametersSet()
    {
        if (!initialized)
            initialized = true;
    }
}
