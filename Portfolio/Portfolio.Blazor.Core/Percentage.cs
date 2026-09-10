namespace Portfolio.Blazor.Core;

public enum PercentageError
{
    None,
    InvalidInput,
    DivisionByZero,
}

public readonly record struct PercentageResult(
    bool IsValid,
    double Value,
    double Percentage,
    double Result,
    PercentageError Error = PercentageError.None
);

public readonly record struct PercentageWhatPercentResult(
    bool IsValid,
    double X,
    double Y,
    double Percentage,
    PercentageError Error = PercentageError.None
);

public readonly record struct PercentageOfWhatResult(
    bool IsValid,
    double X,
    double Y,
    double Whole,
    PercentageError Error = PercentageError.None
);

public readonly record struct PercentageChangeResult(
    bool IsValid,
    double From,
    double To,
    double DeltaPercent,
    bool IsIncrease,
    PercentageError Error = PercentageError.None
);

public static class PercentageCalculator
{
    public static PercentageResult Calculate(double value, double percentage)
    {
        if (!double.IsFinite(value) || !double.IsFinite(percentage))
        {
            return Invalid();
        }

        return new PercentageResult(true, value, percentage, value * percentage / 100d);
    }

    public static PercentageWhatPercentResult WhatPercentOf(double x, double y)
    {
        if (!double.IsFinite(x) || !double.IsFinite(y))
        {
            return new PercentageWhatPercentResult(false, x, y, 0, PercentageError.InvalidInput);
        }

        if (y == 0)
        {
            return new PercentageWhatPercentResult(false, x, y, 0, PercentageError.DivisionByZero);
        }

        return new PercentageWhatPercentResult(true, x, y, x / y * 100d);
    }

    public static PercentageOfWhatResult OfWhat(double x, double y)
    {
        if (!double.IsFinite(x) || !double.IsFinite(y))
        {
            return new PercentageOfWhatResult(false, x, y, 0, PercentageError.InvalidInput);
        }

        if (y == 0)
        {
            return new PercentageOfWhatResult(false, x, y, 0, PercentageError.DivisionByZero);
        }

        return new PercentageOfWhatResult(true, x, y, x / (y / 100d));
    }

    public static PercentageChangeResult Change(double from, double to)
    {
        if (!double.IsFinite(from) || !double.IsFinite(to))
        {
            return new PercentageChangeResult(
                false,
                from,
                to,
                0,
                false,
                PercentageError.InvalidInput
            );
        }

        if (from == 0)
        {
            return new PercentageChangeResult(
                false,
                from,
                to,
                0,
                false,
                PercentageError.DivisionByZero
            );
        }

        var delta = (to - from) / Math.Abs(from) * 100d;
        return new PercentageChangeResult(true, from, to, delta, delta >= 0);
    }

    private static PercentageResult Invalid() => new(false, 0, 0, 0, PercentageError.InvalidInput);
}
