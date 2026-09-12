namespace Blog.Blazor.Core;

public readonly record struct DateDifferenceResult(
    bool IsValid,
    bool HasInput,
    bool Reversed,
    int TotalDays,
    int Years,
    int Months,
    int Days
);

public static class DateDifferenceCalculator
{
    public static DateDifferenceResult Calculate(DateOnly? start, DateOnly? end)
    {
        if (!start.HasValue || !end.HasValue)
            return new(false, start.HasValue || end.HasValue, false, 0, 0, 0, 0);
        var reversed = start > end;
        var earlier = reversed ? end.Value : start.Value;
        var later = reversed ? start.Value : end.Value;
        var years = later.Year - earlier.Year;
        var months = later.Month - earlier.Month;
        var days = later.Day - earlier.Day;
        if (days < 0)
        {
            months--;
            days += DateTime.DaysInMonth(later.Year, later.Month == 1 ? 1 : later.Month - 1);
        }
        if (months < 0)
        {
            years--;
            months += 12;
        }
        return new(true, true, reversed, later.DayNumber - earlier.DayNumber, years, months, days);
    }
}

public readonly record struct AgeResult(bool IsValid, int Years, int Months, int Days);

public static class AgeCalculator
{
    public static AgeResult Calculate(DateOnly birthDate, DateOnly asOf)
    {
        if (birthDate > asOf)
            return new(false, 0, 0, 0);
        var years = asOf.Year - birthDate.Year;
        var anniversary = birthDate.AddYears(years);
        if (anniversary > asOf)
        {
            years--;
            anniversary = birthDate.AddYears(years);
        }
        var months = 0;
        while (anniversary.AddMonths(months + 1) <= asOf)
            months++;
        var remainder = anniversary.AddMonths(months);
        return new(true, years, months, asOf.DayNumber - remainder.DayNumber);
    }
}

public readonly record struct BmiResult(bool IsValid, double Value, string Category);

public static class BmiCalculator
{
    public static BmiResult Calculate(double weightKg, double heightCm)
    {
        if (
            !double.IsFinite(weightKg)
            || !double.IsFinite(heightCm)
            || weightKg <= 0
            || heightCm <= 0
        )
            return new(false, 0, "");
        var value = weightKg / Math.Pow(heightCm / 100d, 2);
        var category =
            value < 18.5 ? "underweight"
            : value < 25 ? "normal"
            : value < 30 ? "overweight"
            : "obesity";
        return new(true, value, category);
    }
}

public enum UnitKind
{
    Length,
    Mass,
    Temperature,
}

public readonly record struct UnitConversionResult(bool IsValid, double Value, string Error = "");

public static class UnitConverter
{
    public static UnitConversionResult Convert(double value, string from, string to)
    {
        if (!double.IsFinite(value))
            return new(false, 0, "invalid value");
        if (
            !TryUnit(from, out var source)
            || !TryUnit(to, out var target)
            || source.Kind != target.Kind
        )
            return new(false, 0, "incompatible units");
        var baseValue =
            source.Kind == UnitKind.Temperature
                ? ToCelsius(value, source.Factor)
                : value * source.Factor;
        var result =
            source.Kind == UnitKind.Temperature
                ? FromCelsius(baseValue, target.Factor)
                : baseValue / target.Factor;
        return double.IsFinite(result) ? new(true, result) : new(false, 0, "invalid result");
    }

    public static IReadOnlyList<(string Id, string Label)> Units =>
        [
            ("mm", "millimetres"),
            ("cm", "centimetres"),
            ("m", "metres"),
            ("km", "kilometres"),
            ("in", "inches"),
            ("ft", "feet"),
            ("yd", "yards"),
            ("mi", "miles"),
            ("mg", "milligrams"),
            ("g", "grams"),
            ("kg", "kilograms"),
            ("oz", "ounces"),
            ("lb", "pounds"),
            ("c", "Celsius"),
            ("f", "Fahrenheit"),
            ("k", "Kelvin"),
        ];

    private static bool TryUnit(string id, out (UnitKind Kind, double Factor) unit)
    {
        unit = id.ToLowerInvariant() switch
        {
            "mm" => (UnitKind.Length, 0.001),
            "cm" => (UnitKind.Length, 0.01),
            "m" => (UnitKind.Length, 1),
            "km" => (UnitKind.Length, 1000),
            "in" => (UnitKind.Length, 0.0254),
            "ft" => (UnitKind.Length, 0.3048),
            "yd" => (UnitKind.Length, 0.9144),
            "mi" => (UnitKind.Length, 1609.344),
            "mg" => (UnitKind.Mass, 0.000001),
            "g" => (UnitKind.Mass, 0.001),
            "kg" => (UnitKind.Mass, 1),
            "oz" => (UnitKind.Mass, 0.028349523125),
            "lb" => (UnitKind.Mass, 0.45359237),
            "c" => (UnitKind.Temperature, 0),
            "f" => (UnitKind.Temperature, 1),
            "k" => (UnitKind.Temperature, 2),
            _ => default,
        };
        return id.ToLowerInvariant()
            is "mm"
                or "cm"
                or "m"
                or "km"
                or "in"
                or "ft"
                or "yd"
                or "mi"
                or "mg"
                or "g"
                or "kg"
                or "oz"
                or "lb"
                or "c"
                or "f"
                or "k";
    }

    private static double ToCelsius(double value, double marker) =>
        marker switch
        {
            0 => value,
            1 => (value - 32) * 5 / 9,
            2 => value - 273.15,
            _ => double.NaN,
        };

    private static double FromCelsius(double value, double marker) =>
        marker switch
        {
            0 => value,
            1 => value * 9 / 5 + 32,
            2 => value + 273.15,
            _ => double.NaN,
        };
}
