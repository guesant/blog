namespace Portfolio.Blazor.Core;

public enum ChemistryError
{
    None,
    InvalidInput,
    NeedMoreValues,
}

public readonly record struct DilutionResult(
    bool IsValid,
    double C1,
    double V1,
    double C2,
    double V2,
    ChemistryError Error = ChemistryError.None
);

public readonly record struct PhResult(
    bool IsValid,
    double Concentration,
    double Ph,
    double Poh,
    ChemistryError Error = ChemistryError.None
);

public static class ChemistryCalculator
{
    public static DilutionResult Dilution(double? c1, double? v1, double? c2, double? v2)
    {
        var values = new[] { c1, v1, c2, v2 };
        if (
            values.Count(value => value.HasValue) != 3
            || values.Any(value =>
                value.HasValue && (!double.IsFinite(value.Value) || value.Value <= 0)
            )
        )
        {
            return new DilutionResult(
                false,
                0,
                0,
                0,
                0,
                values.Count(value => value.HasValue) < 3
                    ? ChemistryError.NeedMoreValues
                    : ChemistryError.InvalidInput
            );
        }

        var result = (c1, v1, c2, v2) switch
        {
            (null, var volume1, var concentration2, var volume2) => (
                concentration2!.Value * volume2!.Value / volume1!.Value,
                volume1.Value,
                concentration2.Value,
                volume2.Value
            ),
            (var concentration1, null, var concentration2, var volume2) => (
                concentration1!.Value,
                concentration1.Value * volume2!.Value / concentration2!.Value,
                concentration2.Value,
                volume2.Value
            ),
            (var concentration1, var volume1, null, var volume2) => (
                concentration1!.Value,
                volume1!.Value,
                concentration1.Value * volume1.Value / volume2!.Value,
                volume2.Value
            ),
            (var concentration1, var volume1, var concentration2, null) => (
                concentration1!.Value,
                volume1!.Value,
                concentration2!.Value,
                concentration1.Value * volume1.Value / concentration2.Value
            ),
            _ => (0, 0, 0, 0),
        };

        return new DilutionResult(true, result.Item1, result.Item2, result.Item3, result.Item4);
    }

    public static PhResult Ph(double concentration)
    {
        if (!double.IsFinite(concentration) || concentration <= 0)
        {
            return new PhResult(false, 0, 0, 0, ChemistryError.InvalidInput);
        }

        var ph = -Math.Log10(concentration);
        return new PhResult(true, concentration, ph, 14 - ph);
    }
}
