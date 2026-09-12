using System.Globalization;
using System.Numerics;

namespace Blog.Blazor.Core;

public readonly record struct ChemicalBalanceResult(
    bool IsValid,
    string Equation,
    IReadOnlyList<string> Elements,
    IReadOnlyList<string> Terms,
    IReadOnlyList<IReadOnlyList<int>> Counts,
    IReadOnlyList<int> Coefficients,
    int ReactantCount,
    string? Error = null
);

public static class ChemicalEquationBalancer
{
    private static readonly HashSet<string> Elements = new(StringComparer.Ordinal)
    {
        "H",
        "He",
        "C",
        "N",
        "O",
        "F",
        "Na",
        "Mg",
        "Al",
        "Si",
        "P",
        "S",
        "Cl",
        "K",
        "Ca",
        "Fe",
        "Cu",
        "Zn",
        "Br",
        "Ag",
        "I",
        "Ba",
        "Au",
        "Hg",
    };

    public const int MaximumCharacters = 500;
    public const int MaximumTerms = 12;

    public static ChemicalBalanceResult Balance(string? equation)
    {
        if (string.IsNullOrWhiteSpace(equation) || equation.Length > MaximumCharacters)
            return Invalid("invalid_input");
        var separator =
            equation.Contains('→') ? '→'
            : equation.Contains("->", StringComparison.Ordinal) ? '-'
            : '=';
        var sides =
            separator == '-'
                ? equation.Split("->", 2, StringSplitOptions.TrimEntries)
                : equation.Split(separator, 2, StringSplitOptions.TrimEntries);
        if (sides.Length != 2 || sides.Any(string.IsNullOrWhiteSpace))
            return Invalid("format_required");

        try
        {
            var reactants = ParseTerms(sides[0]);
            var products = ParseTerms(sides[1]);
            var terms = reactants.Concat(products).ToArray();
            if (terms.Length is < 2 or > MaximumTerms)
                return Invalid("term_limit");
            var elements = terms
                .SelectMany(term => term.Counts.Keys)
                .Distinct(StringComparer.Ordinal)
                .Order(StringComparer.Ordinal)
                .ToArray();
            var matrix = new Rational[elements.Length, terms.Length];
            for (var row = 0; row < elements.Length; row++)
            for (var column = 0; column < terms.Length; column++)
                matrix[row, column] = new Rational(
                    (reactants.Contains(terms[column]) ? 1 : -1)
                        * terms[column].Counts.GetValueOrDefault(elements[row]),
                    1
                );

            var solution = NullVector(matrix);
            var coefficients = ToIntegers(solution);
            var counts = elements
                .Select(element =>
                    (IReadOnlyList<int>)
                        terms.Select(term => term.Counts.GetValueOrDefault(element)).ToArray()
                )
                .ToArray();
            var rendered =
                string.Join(
                    " + ",
                    terms
                        .Take(reactants.Count)
                        .Select(
                            (term, index) =>
                                $"{(coefficients[index] == 1 ? string.Empty : coefficients[index].ToString(CultureInfo.InvariantCulture))}{term.Formula}"
                        )
                )
                + " → "
                + string.Join(
                    " + ",
                    terms
                        .Skip(reactants.Count)
                        .Select(
                            (term, index) =>
                                $"{(coefficients[reactants.Count + index] == 1 ? string.Empty : coefficients[reactants.Count + index].ToString(CultureInfo.InvariantCulture))}{term.Formula}"
                        )
                );
            return new(
                true,
                rendered,
                elements,
                terms.Select(term => term.Formula).ToArray(),
                counts,
                coefficients,
                reactants.Count
            );
        }
        catch (FormatException)
        {
            return Invalid("invalid_formula");
        }
        catch (InvalidOperationException)
        {
            return Invalid("not_balanceable");
        }
    }

    private static List<ChemicalTerm> ParseTerms(string side) =>
        side.Split('+', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
            .Select(ParseTerm)
            .ToList();

    private static ChemicalTerm ParseTerm(string input)
    {
        var text = input.Trim();
        var start = 0;
        while (start < text.Length && char.IsDigit(text[start]))
            start++;
        var formula = text[start..].Replace(" ", string.Empty, StringComparison.Ordinal);
        if (formula.Length == 0)
            throw new FormatException();
        var position = 0;
        var counts = ParseGroup(formula, ref position, false);
        if (position != formula.Length)
            throw new FormatException();
        return new ChemicalTerm(formula, counts);
    }

    private static Dictionary<string, int> ParseGroup(string formula, ref int position, bool nested)
    {
        var counts = new Dictionary<string, int>(StringComparer.Ordinal);
        while (position < formula.Length && formula[position] != ')')
        {
            if (formula[position] == '(')
            {
                position++;
                var inner = ParseGroup(formula, ref position, true);
                if (position >= formula.Length || formula[position] != ')')
                    throw new FormatException();
                position++;
                var multiplier = ReadNumber(formula, ref position);
                Add(counts, inner, multiplier);
                continue;
            }

            if (!char.IsUpper(formula[position]))
                throw new FormatException();
            var symbol = formula[position++].ToString();
            if (position < formula.Length && char.IsLower(formula[position]))
                symbol += formula[position++];
            if (!Elements.Contains(symbol))
                throw new FormatException();
            Add(counts, symbol, ReadNumber(formula, ref position));
        }
        if (nested && position >= formula.Length)
            throw new FormatException();
        return counts;
    }

    private static int ReadNumber(string formula, ref int position)
    {
        var start = position;
        while (position < formula.Length && char.IsDigit(formula[position]))
            position++;
        if (start == position)
            return 1;
        if (!int.TryParse(formula[start..position], out var number) || number is < 1 or > 1000)
            throw new FormatException();
        return number;
    }

    private static void Add(Dictionary<string, int> target, string key, int value) =>
        target[key] = target.GetValueOrDefault(key) + value;

    private static void Add(
        Dictionary<string, int> target,
        Dictionary<string, int> source,
        int multiplier
    )
    {
        foreach (var pair in source)
            Add(target, pair.Key, pair.Value * multiplier);
    }

    private static Rational[] NullVector(Rational[,] source)
    {
        var rows = source.GetLength(0);
        var columns = source.GetLength(1);
        var matrix = (Rational[,])source.Clone();
        var pivots = new List<int>();
        var pivotRow = 0;
        for (var column = 0; column < columns && pivotRow < rows; column++)
        {
            var selected = Enumerable
                .Range(pivotRow, rows - pivotRow)
                .FirstOrDefault(row => !matrix[row, column].IsZero, -1);
            if (selected < 0)
                continue;
            SwapRows(matrix, pivotRow, selected);
            var pivot = matrix[pivotRow, column];
            for (var cell = 0; cell < columns; cell++)
                matrix[pivotRow, cell] /= pivot;
            for (var row = 0; row < rows; row++)
            {
                if (row == pivotRow || matrix[row, column].IsZero)
                    continue;
                var factor = matrix[row, column];
                for (var cell = 0; cell < columns; cell++)
                    matrix[row, cell] -= factor * matrix[pivotRow, cell];
            }
            pivots.Add(column);
            pivotRow++;
        }

        var free = Enumerable
            .Range(0, columns)
            .FirstOrDefault(column => !pivots.Contains(column), -1);
        if (free < 0)
            throw new InvalidOperationException();
        var solution = Enumerable.Repeat(Rational.Zero, columns).ToArray();
        solution[free] = Rational.One;
        for (var pivot = pivots.Count - 1; pivot >= 0; pivot--)
        {
            var column = pivots[pivot];
            var total = Rational.Zero;
            for (var cell = column + 1; cell < columns; cell++)
                total += matrix[pivot, cell] * solution[cell];
            solution[column] = -total;
        }
        return solution;
    }

    private static IReadOnlyList<int> ToIntegers(IReadOnlyList<Rational> values)
    {
        var denominator = values.Aggregate(
            BigInteger.One,
            (current, value) => Lcm(current, value.Denominator)
        );
        var integers = values
            .Select(value => BigInteger.Abs(value.Numerator * (denominator / value.Denominator)))
            .ToArray();
        var divisor = integers.Aggregate(BigInteger.Zero, BigInteger.GreatestCommonDivisor);
        if (divisor == 0)
            throw new InvalidOperationException();
        integers = integers.Select(value => value / divisor).ToArray();
        if (integers.Any(value => value == 0) || integers.Any(value => value > int.MaxValue))
            throw new InvalidOperationException();
        return integers.Select(value => (int)value).ToArray();
    }

    private static BigInteger Lcm(BigInteger left, BigInteger right) =>
        BigInteger.Abs(left / BigInteger.GreatestCommonDivisor(left, right) * right);

    private static void SwapRows(Rational[,] matrix, int first, int second)
    {
        if (first == second)
            return;
        for (var column = 0; column < matrix.GetLength(1); column++)
            (matrix[first, column], matrix[second, column]) = (
                matrix[second, column],
                matrix[first, column]
            );
    }

    private static ChemicalBalanceResult Invalid(string error) =>
        new(false, string.Empty, [], [], [], [], 0, error);

    private sealed record ChemicalTerm(string Formula, IReadOnlyDictionary<string, int> Counts);

    private readonly struct Rational
    {
        public static Rational Zero => new(0, 1);
        public static Rational One => new(1, 1);
        public BigInteger Numerator { get; }
        public BigInteger Denominator { get; }
        public bool IsZero => Numerator.IsZero;

        public Rational(BigInteger numerator, BigInteger denominator)
        {
            if (denominator.IsZero)
                throw new DivideByZeroException();
            if (denominator.Sign < 0)
            {
                numerator = -numerator;
                denominator = -denominator;
            }
            var gcd = BigInteger.GreatestCommonDivisor(BigInteger.Abs(numerator), denominator);
            Numerator = numerator / gcd;
            Denominator = denominator / gcd;
        }

        public static Rational operator +(Rational left, Rational right) =>
            new(
                left.Numerator * right.Denominator + right.Numerator * left.Denominator,
                left.Denominator * right.Denominator
            );

        public static Rational operator -(Rational left, Rational right) => left + -right;

        public static Rational operator -(Rational value) =>
            new(-value.Numerator, value.Denominator);

        public static Rational operator *(Rational left, Rational right) =>
            new(left.Numerator * right.Numerator, left.Denominator * right.Denominator);

        public static Rational operator /(Rational left, Rational right) =>
            new(left.Numerator * right.Denominator, left.Denominator * right.Numerator);
    }
}
