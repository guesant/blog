namespace Portfolio.Blazor.Core;

public enum ComplexNumberError
{
    None,
    InvalidInput,
    DivisionByZero,
}

public readonly record struct ComplexCalculationResult(
    bool IsValid,
    ComplexNumber Value,
    double Magnitude,
    ComplexNumberError Error = ComplexNumberError.None
);

public static class ComplexNumberCalculator
{
    public static ComplexCalculationResult Calculate(
        string? first,
        string? second,
        string? operation
    )
    {
        if (!TryParse(first, out var left) || !TryParse(second, out var right))
            return Invalid(ComplexNumberError.InvalidInput);
        var value = operation?.ToLowerInvariant() switch
        {
            "add" => new ComplexNumber(left.Real + right.Real, left.Imaginary + right.Imaginary),
            "subtract" => new ComplexNumber(
                left.Real - right.Real,
                left.Imaginary - right.Imaginary
            ),
            "multiply" => new ComplexNumber(
                left.Real * right.Real - left.Imaginary * right.Imaginary,
                left.Real * right.Imaginary + left.Imaginary * right.Real
            ),
            "divide" when right.Real * right.Real + right.Imaginary * right.Imaginary > 0 =>
                new ComplexNumber(
                    (left.Real * right.Real + left.Imaginary * right.Imaginary)
                        / (right.Real * right.Real + right.Imaginary * right.Imaginary),
                    (left.Imaginary * right.Real - left.Real * right.Imaginary)
                        / (right.Real * right.Real + right.Imaginary * right.Imaginary)
                ),
            "divide" => default,
            _ => default,
        };
        if (operation is not ("add" or "subtract" or "multiply" or "divide"))
            return Invalid(ComplexNumberError.InvalidInput);
        if (operation == "divide" && right.Real == 0 && right.Imaginary == 0)
            return Invalid(ComplexNumberError.DivisionByZero);
        return new ComplexCalculationResult(
            true,
            value,
            Math.Sqrt(value.Real * value.Real + value.Imaginary * value.Imaginary)
        );
    }

    private static bool TryParse(string? text, out ComplexNumber value)
    {
        value = default;
        var input = text?.Replace(" ", string.Empty, StringComparison.Ordinal) ?? string.Empty;
        if (input.Length == 0)
            return false;
        if (!input.EndsWith('i'))
            return double.TryParse(
                    input,
                    System.Globalization.NumberStyles.Float,
                    System.Globalization.CultureInfo.InvariantCulture,
                    out var real
                ) && Set(new(real, 0), out value);
        var body = input[..^1];
        if (body is "" or "+")
            return Set(new(0, 1), out value);
        if (body == "-")
            return Set(new(0, -1), out value);
        var separator = body[1..].IndexOfAny(['+', '-']);
        if (separator < 0)
            return double.TryParse(
                    body,
                    System.Globalization.NumberStyles.Float,
                    System.Globalization.CultureInfo.InvariantCulture,
                    out var imaginary
                ) && Set(new(0, imaginary), out value);
        separator++;
        return double.TryParse(
                body[..separator],
                System.Globalization.NumberStyles.Float,
                System.Globalization.CultureInfo.InvariantCulture,
                out var realPart
            )
            && double.TryParse(
                body[separator..],
                System.Globalization.NumberStyles.Float,
                System.Globalization.CultureInfo.InvariantCulture,
                out var imaginaryPart
            )
            && Set(new(realPart, imaginaryPart), out value);
    }

    private static bool Set(ComplexNumber source, out ComplexNumber value)
    {
        value = source;
        return true;
    }

    private static ComplexCalculationResult Invalid(ComplexNumberError error) =>
        new(false, default, 0, error);
}
