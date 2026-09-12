namespace Blog.Blazor.Core;

public enum OhmLawError
{
    None,
    NeedTwoValues,
    InvalidValue,
}

public readonly record struct OhmLawResult(
    bool IsValid,
    double Voltage,
    double Current,
    double Resistance,
    double Power,
    OhmLawError Error = OhmLawError.None
);

public static class OhmLawCalculator
{
    public static OhmLawResult Solve(
        double? voltage,
        double? current,
        double? resistance,
        double? power
    )
    {
        var values = new[] { voltage, current, resistance, power };
        if (values.Count(value => value.HasValue) < 2)
        {
            return Invalid(OhmLawError.NeedTwoValues);
        }

        if (
            values.Any(value =>
                value is <= 0 or double.NaN or double.PositiveInfinity or double.NegativeInfinity
            )
        )
        {
            return Invalid(OhmLawError.InvalidValue);
        }

        double v;
        double i;
        double r;
        double p;
        if (voltage.HasValue && current.HasValue)
        {
            v = voltage.Value;
            i = current.Value;
            r = v / i;
            p = v * i;
        }
        else if (voltage.HasValue && resistance.HasValue)
        {
            v = voltage.Value;
            r = resistance.Value;
            i = v / r;
            p = v * i;
        }
        else if (voltage.HasValue && power.HasValue)
        {
            v = voltage.Value;
            p = power.Value;
            i = p / v;
            r = v / i;
        }
        else if (current.HasValue && resistance.HasValue)
        {
            i = current.Value;
            r = resistance.Value;
            v = i * r;
            p = v * i;
        }
        else if (current.HasValue && power.HasValue)
        {
            i = current.Value;
            p = power.Value;
            v = p / i;
            r = v / i;
        }
        else
        {
            r = resistance!.Value;
            p = power!.Value;
            i = Math.Sqrt(p / r);
            v = i * r;
        }

        return new OhmLawResult(true, v, i, r, p);
    }

    private static OhmLawResult Invalid(OhmLawError error) =>
        new(false, double.NaN, double.NaN, double.NaN, double.NaN, error);
}
