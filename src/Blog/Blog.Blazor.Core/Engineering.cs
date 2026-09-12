namespace Blog.Blazor.Core;

public enum EngineeringError
{
    None,
    InvalidInput,
}

public readonly record struct EquivalentResistanceResult(
    bool IsValid,
    double Resistance,
    EngineeringError Error = EngineeringError.None
);

public static class EngineeringCalculator
{
    public static EquivalentResistanceResult EquivalentResistance(
        IEnumerable<double> resistances,
        string mode
    )
    {
        var values = resistances.ToArray();
        if (values.Length == 0 || values.Any(value => !double.IsFinite(value) || value <= 0))
        {
            return new EquivalentResistanceResult(false, 0, EngineeringError.InvalidInput);
        }

        var resistance = mode.Equals("parallel", StringComparison.OrdinalIgnoreCase)
            ? 1 / values.Sum(value => 1 / value)
            : values.Sum();
        return new EquivalentResistanceResult(true, resistance);
    }
}
