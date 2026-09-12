using System.Globalization;

namespace Blog.Blazor.Core;

public readonly record struct MatrixCalculationResult(
    bool IsValid,
    double? Scalar,
    IReadOnlyList<IReadOnlyList<double>> Matrix,
    string? Error = null
);

public static class MatrixCalculator
{
    public const int MaximumDimension = 6;

    public static MatrixCalculationResult Calculate(string? input, string operation)
    {
        var matrix = Parse(input);
        if (matrix is null || matrix.GetLength(0) != matrix.GetLength(1))
            return Invalid("square_matrix_required");

        var dimension = matrix.GetLength(0);
        if (dimension == 0 || dimension > MaximumDimension)
            return Invalid("matrix_size_limit");

        return operation.Trim().ToLowerInvariant() switch
        {
            "determinant" => new(true, Determinant(matrix), [], null),
            "transpose" => new(true, null, ToRows(Transpose(matrix)), null),
            "inverse" => Inverse(matrix, dimension),
            _ => Invalid("unknown_operation"),
        };
    }

    private static MatrixCalculationResult Inverse(double[,] matrix, int dimension)
    {
        var augmented = new double[dimension, dimension * 2];
        for (var row = 0; row < dimension; row++)
        {
            for (var column = 0; column < dimension; column++)
                augmented[row, column] = matrix[row, column];
            augmented[row, dimension + row] = 1;
        }

        for (var pivot = 0; pivot < dimension; pivot++)
        {
            var pivotRow = Enumerable
                .Range(pivot, dimension - pivot)
                .OrderByDescending(row => Math.Abs(augmented[row, pivot]))
                .First();
            if (Math.Abs(augmented[pivotRow, pivot]) < 1e-12)
                return Invalid("singular_matrix");
            SwapRows(augmented, pivot, pivotRow);
            var divisor = augmented[pivot, pivot];
            for (var column = 0; column < dimension * 2; column++)
                augmented[pivot, column] /= divisor;

            for (var row = 0; row < dimension; row++)
            {
                if (row == pivot)
                    continue;
                var factor = augmented[row, pivot];
                for (var column = 0; column < dimension * 2; column++)
                    augmented[row, column] -= factor * augmented[pivot, column];
            }
        }

        var result = new double[dimension, dimension];
        for (var row = 0; row < dimension; row++)
        for (var column = 0; column < dimension; column++)
            result[row, column] = Clean(augmented[row, dimension + column]);
        return new(true, null, ToRows(result), null);
    }

    private static double Determinant(double[,] source)
    {
        var matrix = (double[,])source.Clone();
        var dimension = matrix.GetLength(0);
        var sign = 1d;
        var result = 1d;
        for (var pivot = 0; pivot < dimension; pivot++)
        {
            var pivotRow = Enumerable
                .Range(pivot, dimension - pivot)
                .OrderByDescending(row => Math.Abs(matrix[row, pivot]))
                .First();
            if (Math.Abs(matrix[pivotRow, pivot]) < 1e-12)
                return 0;
            if (pivotRow != pivot)
            {
                SwapRows(matrix, pivot, pivotRow);
                sign *= -1;
            }
            var pivotValue = matrix[pivot, pivot];
            result *= pivotValue;
            for (var row = pivot + 1; row < dimension; row++)
            {
                var factor = matrix[row, pivot] / pivotValue;
                for (var column = pivot + 1; column < dimension; column++)
                    matrix[row, column] -= factor * matrix[pivot, column];
            }
        }
        return Clean(sign * result);
    }

    private static double[,] Transpose(double[,] matrix)
    {
        var result = new double[matrix.GetLength(1), matrix.GetLength(0)];
        for (var row = 0; row < matrix.GetLength(0); row++)
        for (var column = 0; column < matrix.GetLength(1); column++)
            result[column, row] = matrix[row, column];
        return result;
    }

    private static double[,]? Parse(string? input)
    {
        var rows = (input ?? string.Empty)
            .Split(['\n', '\r'], StringSplitOptions.RemoveEmptyEntries)
            .Select(line =>
                line.Split([',', ';', ' ', '\t'], StringSplitOptions.RemoveEmptyEntries)
                    .Select(value =>
                        double.TryParse(
                            value,
                            NumberStyles.Float,
                            CultureInfo.InvariantCulture,
                            out var number
                        ) && double.IsFinite(number)
                            ? (double?)number
                            : null
                    )
                    .ToArray()
            )
            .ToArray();
        if (
            rows.Length == 0
            || rows.Any(row => row.Length == 0 || row.Any(value => !value.HasValue))
            || rows.Any(row => row.Length != rows[0].Length)
        )
            return null;
        var matrix = new double[rows.Length, rows[0].Length];
        for (var row = 0; row < rows.Length; row++)
        {
            for (var column = 0; column < rows[0].Length; column++)
                matrix[row, column] = rows[row][column]!.Value;
        }
        return matrix;
    }

    private static IReadOnlyList<IReadOnlyList<double>> ToRows(double[,] matrix) =>
        Enumerable
            .Range(0, matrix.GetLength(0))
            .Select(row =>
                (IReadOnlyList<double>)
                    Enumerable
                        .Range(0, matrix.GetLength(1))
                        .Select(column => Clean(matrix[row, column]))
                        .ToArray()
            )
            .ToArray();

    private static void SwapRows(double[,] matrix, int first, int second)
    {
        if (first == second)
            return;
        for (var column = 0; column < matrix.GetLength(1); column++)
            (matrix[first, column], matrix[second, column]) = (
                matrix[second, column],
                matrix[first, column]
            );
    }

    private static double Clean(double value) => Math.Abs(value) < 1e-12 ? 0 : value;

    private static MatrixCalculationResult Invalid(string error) => new(false, null, [], error);
}
