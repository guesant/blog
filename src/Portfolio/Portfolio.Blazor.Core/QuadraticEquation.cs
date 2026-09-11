namespace Portfolio.Blazor.Core;

public readonly record struct ComplexNumber(double Real, double Imaginary);

public enum QuadraticEquationError
{
    None,
    NonFiniteInput,
    ZeroLeadingCoefficient,
}

public readonly record struct QuadraticEquationResult(
    bool IsValid,
    double Discriminant,
    ComplexNumber Root1,
    ComplexNumber Root2,
    QuadraticEquationError Error = QuadraticEquationError.None
)
{
    public bool HasRealRoots => IsValid && Discriminant >= 0;

    public bool HasComplexRoots => IsValid && Discriminant < 0;
}

public static class QuadraticEquationSolver
{
    public static QuadraticEquationResult Solve(double a, double b, double c)
    {
        if (
            double.IsNaN(a)
            || double.IsNaN(b)
            || double.IsNaN(c)
            || double.IsInfinity(a)
            || double.IsInfinity(b)
            || double.IsInfinity(c)
        )
        {
            return Invalid(QuadraticEquationError.NonFiniteInput);
        }

        if (a == 0)
        {
            return Invalid(QuadraticEquationError.ZeroLeadingCoefficient);
        }

        var discriminant = b * b - (4 * a * c);

        if (discriminant >= 0)
        {
            var squareRoot = Math.Sqrt(discriminant);
            return new QuadraticEquationResult(
                IsValid: true,
                Discriminant: discriminant,
                Root1: new((-b + squareRoot) / (2 * a), 0),
                Root2: new((-b - squareRoot) / (2 * a), 0)
            );
        }

        var imaginaryPart = Math.Sqrt(-discriminant) / Math.Abs(2 * a);
        var realPart = -b / (2 * a);

        return new QuadraticEquationResult(
            IsValid: true,
            Discriminant: discriminant,
            Root1: new(realPart, imaginaryPart),
            Root2: new(realPart, -imaginaryPart)
        );
    }

    private static QuadraticEquationResult Invalid(QuadraticEquationError error) =>
        new(IsValid: false, Discriminant: double.NaN, Root1: default, Root2: default, Error: error);
}
