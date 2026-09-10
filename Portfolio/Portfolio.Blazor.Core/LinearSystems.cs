namespace Portfolio.Blazor.Core;

public sealed record LinearSystemResult(bool IsValid, double[] Solution, string? Error);

public static class LinearSystemCalculator
{
    public static LinearSystemResult Solve(double[,] coefficients, double[] constants)
    {
        var rows = coefficients.GetLength(0);
        var columns = coefficients.GetLength(1);
        if (rows is < 2 or > 3 || columns != rows || constants.Length != rows)
        {
            return Invalid("invalid_dimensions");
        }

        var matrix = new double[rows, columns + 1];
        for (var row = 0; row < rows; row++)
        {
            for (var column = 0; column < columns; column++)
            {
                if (!double.IsFinite(coefficients[row, column]))
                    return Invalid("invalid_input");
                matrix[row, column] = coefficients[row, column];
            }
            if (!double.IsFinite(constants[row]))
                return Invalid("invalid_input");
            matrix[row, columns] = constants[row];
        }

        for (var pivot = 0; pivot < rows; pivot++)
        {
            var bestRow = pivot;
            for (var row = pivot + 1; row < rows; row++)
            {
                if (Math.Abs(matrix[row, pivot]) > Math.Abs(matrix[bestRow, pivot]))
                    bestRow = row;
            }
            if (Math.Abs(matrix[bestRow, pivot]) < 1e-12)
                return Invalid("singular_system");
            SwapRows(matrix, pivot, bestRow, columns + 1);

            var divisor = matrix[pivot, pivot];
            for (var column = pivot; column <= columns; column++)
                matrix[pivot, column] /= divisor;
            for (var row = 0; row < rows; row++)
            {
                if (row == pivot)
                    continue;
                var factor = matrix[row, pivot];
                for (var column = pivot; column <= columns; column++)
                    matrix[row, column] -= factor * matrix[pivot, column];
            }
        }

        var solution = Enumerable.Range(0, rows).Select(row => matrix[row, columns]).ToArray();
        return new(true, solution, null);
    }

    private static void SwapRows(double[,] matrix, int first, int second, int columns)
    {
        if (first == second)
            return;
        for (var column = 0; column < columns; column++)
            (matrix[first, column], matrix[second, column]) = (
                matrix[second, column],
                matrix[first, column]
            );
    }

    private static LinearSystemResult Invalid(string error) => new(false, [], error);
}
