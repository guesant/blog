using System.Globalization;

namespace Portfolio.Blazor.Core;

public readonly record struct FunctionPlotPoint(double X, double Y);

public readonly record struct FunctionPlotResult(
    bool IsValid,
    IReadOnlyList<FunctionPlotPoint> Points,
    string? Error = null
);

public static class FunctionPlotter
{
    public const int MaximumExpressionCharacters = 200;
    public const int SampleCount = 201;
    public const double MaximumRange = 1_000_000;

    public static FunctionPlotResult Analyze(string? expression, double minimum, double maximum)
    {
        if (
            string.IsNullOrWhiteSpace(expression)
            || expression.Length > MaximumExpressionCharacters
            || !double.IsFinite(minimum)
            || !double.IsFinite(maximum)
            || maximum <= minimum
            || maximum - minimum > MaximumRange
        )
        {
            return Invalid("invalid_input");
        }

        try
        {
            var function = new ExpressionParser(expression).Parse();
            var points = Enumerable
                .Range(0, SampleCount)
                .Select(index => minimum + (maximum - minimum) * index / (SampleCount - 1))
                .Select(x => new FunctionPlotPoint(x, function(x)))
                .Where(point => double.IsFinite(point.Y))
                .ToArray();
            return points.Length >= 2 ? new(true, points) : Invalid("no_finite_points");
        }
        catch (FormatException)
        {
            return Invalid("invalid_expression");
        }
        catch (OverflowException)
        {
            return Invalid("invalid_expression");
        }
    }

    private static FunctionPlotResult Invalid(string error) => new(false, [], error);

    private sealed class ExpressionParser
    {
        private readonly string _source;
        private int _position;

        public ExpressionParser(string source) => _source = source;

        public Func<double, double> Parse()
        {
            var expression = ParseAddSub();
            SkipWhitespace();
            if (_position != _source.Length)
                throw new FormatException();
            return expression;
        }

        private Func<double, double> ParseAddSub()
        {
            var left = ParseMulDiv();
            while (true)
            {
                if (Match('+'))
                {
                    var right = ParseMulDiv();
                    var previous = left;
                    left = x => previous(x) + right(x);
                }
                else if (Match('-'))
                {
                    var right = ParseMulDiv();
                    var previous = left;
                    left = x => previous(x) - right(x);
                }
                else
                    return left;
            }
        }

        private Func<double, double> ParseMulDiv()
        {
            var left = ParsePower();
            while (true)
            {
                if (Match('*'))
                {
                    var right = ParsePower();
                    var previous = left;
                    left = x => previous(x) * right(x);
                }
                else if (Match('/'))
                {
                    var right = ParsePower();
                    var previous = left;
                    left = x => previous(x) / right(x);
                }
                else
                    return left;
            }
        }

        private Func<double, double> ParsePower()
        {
            var left = ParseUnary();
            if (!Match('^'))
                return left;
            var right = ParsePower();
            return x => Math.Pow(left(x), right(x));
        }

        private Func<double, double> ParseUnary()
        {
            if (Match('+'))
                return ParseUnary();
            if (Match('-'))
            {
                var value = ParseUnary();
                return x => -value(x);
            }
            return ParsePrimary();
        }

        private Func<double, double> ParsePrimary()
        {
            SkipWhitespace();
            if (Match('('))
            {
                var value = ParseAddSub();
                if (!Match(')'))
                    throw new FormatException();
                return value;
            }

            if (
                _position < _source.Length
                && (char.IsDigit(_source[_position]) || _source[_position] == '.')
            )
            {
                var start = _position;
                while (
                    _position < _source.Length
                    && (
                        char.IsDigit(_source[_position])
                        || _source[_position] is '.' or 'e' or 'E' or '+' or '-'
                    )
                )
                {
                    if (
                        (_source[_position] is '+' or '-')
                        && _position > start
                        && _source[_position - 1] is not 'e' and not 'E'
                    )
                        break;
                    _position++;
                }
                if (
                    !double.TryParse(
                        _source[start.._position],
                        NumberStyles.Float,
                        CultureInfo.InvariantCulture,
                        out var number
                    )
                )
                    throw new FormatException();
                return _ => number;
            }

            var identifier = ReadIdentifier();
            if (identifier.Length == 0)
                throw new FormatException();
            if (identifier.Equals("x", StringComparison.OrdinalIgnoreCase))
                return x => x;
            if (identifier.Equals("pi", StringComparison.OrdinalIgnoreCase))
                return _ => Math.PI;
            if (identifier.Equals("e", StringComparison.OrdinalIgnoreCase))
                return _ => Math.E;
            if (!Match('('))
                throw new FormatException();
            var argument = ParseAddSub();
            if (!Match(')'))
                throw new FormatException();
            return identifier.ToLowerInvariant() switch
            {
                "sin" => x => Math.Sin(argument(x)),
                "cos" => x => Math.Cos(argument(x)),
                "tan" => x => Math.Tan(argument(x)),
                "sqrt" => x => Math.Sqrt(argument(x)),
                "abs" => x => Math.Abs(argument(x)),
                "exp" => x => Math.Exp(argument(x)),
                "log" or "ln" => x => Math.Log(argument(x)),
                _ => throw new FormatException(),
            };
        }

        private string ReadIdentifier()
        {
            SkipWhitespace();
            var start = _position;
            while (_position < _source.Length && char.IsLetter(_source[_position]))
                _position++;
            return _source[start.._position];
        }

        private bool Match(char character)
        {
            SkipWhitespace();
            if (_position >= _source.Length || _source[_position] != character)
                return false;
            _position++;
            return true;
        }

        private void SkipWhitespace()
        {
            while (_position < _source.Length && char.IsWhiteSpace(_source[_position]))
                _position++;
        }
    }
}
