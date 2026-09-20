import { numbers } from './legacy-tool-numbers';
import { formatNumber } from './legacy-tool-format-number';
import { gcd } from './legacy-tool-gcd';
import { primeFactors } from './legacy-tool-prime-factors';

export function calculateTool(slug: string, input: string, second: string, third: string) {
  const values = numbers(input);

  switch (slug) {
    case 'quadratic-equation': {
      const [a, b, c] = values;

      const discriminant = b * b - 4 * a * c;

      if (!a || discriminant < 0) return 'No real roots';
      return `x₁ = ${formatNumber((-b + Math.sqrt(discriminant)) / (2 * a))}\nx₂ = ${formatNumber((-b - Math.sqrt(discriminant)) / (2 * a))}`;
    }
    case 'percentage-calculator':
      return `${formatNumber((values[0] * values[1]) / 100)} (${formatNumber(values[1])}% of ${formatNumber(values[0])})`;
    case 'gcd-lcm-calculator': {
      const [a, b] = values;

      const divisor = gcd(a, b);

      return `GCD: ${divisor}\nLCM: ${formatNumber(Math.abs(a * b) / divisor)}`;
    }
    case 'prime-factorization':
      return primeFactors(values[0]);
    case 'combinatorics': {
      const [n, r] = values;

      const factorial = (value: number) =>
        Array.from({ length: Math.max(0, value) }, (_, index) => index + 1).reduce(
          (a, b) => a * b,
          1,
        );

      return formatNumber(factorial(n) / (factorial(r) * factorial(n - r)));
    }
    case 'base-converter': {
      const [value, from = 10, to = 16] = values;

      return parseInt(String(value), from).toString(to).toUpperCase();
    }
    case 'number-base-converter': {
      const value = input.trim().replace(/^0[xob]/i, '');

      let base = 10;
      if (/^0x/i.test(input)) {
        base = 16;
      } else if (/^0o/i.test(input)) {
        base = 8;
      } else if (/^0b/i.test(input)) {
        base = 2;
      }

      const decimal = parseInt(value, base);

      return `Decimal: ${decimal}\nBinary: ${decimal.toString(2)}\nOctal: ${decimal.toString(8)}\nHexadecimal: ${decimal.toString(16).toUpperCase()}`;
    }
    case 'fractions':
    case 'fraction-calculator': {
      const match = input.match(/(-?\d+)\s*\/\s*(\d+)\s*([+\-*\/])\s*(-?\d+)\s*\/\s*(\d+)/);

      if (!match) return 'Use the format a/b + c/d';

      const [, an, ad, operator, bn, bd] = match;

      const a = Number(an),
        b = Number(ad),
        c = Number(bn),
        d = Number(bd);

      let numerator = a * d;
      if (operator === '+') {
        numerator = a * d + c * b;
      } else if (operator === '-') {
        numerator = a * d - c * b;
      } else if (operator === '*') {
        numerator = a * c;
      }
      let denominator = b * c;
      if (operator === '+' || operator === '-' || operator === '*') {
        denominator = b * d;
      }

      const divisor = gcd(numerator, denominator);

      return `${numerator / divisor}/${denominator / divisor}`;
    }
    case 'bmi-calculator':
      return `BMI: ${formatNumber(values[0] / (values[1] * values[1]))}`;
    case 'triangle-calculator': {
      const [a, b, c] = values;

      const semiperimeter = (a + b + c) / 2;

      return `Perimeter: ${formatNumber(a + b + c)}\nArea: ${formatNumber(Math.sqrt(semiperimeter * (semiperimeter - a) * (semiperimeter - b) * (semiperimeter - c)))}`;
    }
    case 'arithmetic-progression':
      return formatNumber((values[0] ?? 0) + (values[1] ?? 0) * ((values[2] ?? 1) - 1));
    case 'geometric-progression':
      return formatNumber((values[0] ?? 0) * (values[1] ?? 1) ** ((values[2] ?? 1) - 1));
    case 'age-calculator': {
      const birth = new Date(input);

      const age = new Date().getFullYear() - birth.getFullYear();

      return `${age - (new Date().getTime() < new Date(new Date().getFullYear(), birth.getMonth(), birth.getDate()).getTime() ? 1 : 0)} years`;
    }
    case 'date-difference-calculator':
      return `${Math.abs((new Date(second || input).getTime() - new Date(input).getTime()) / 86400000)} days`;
    case 'ohms-law':
    case 'ohm-law':
      return `Voltage: ${formatNumber(values[0] * values[1])}\nCurrent: ${formatNumber(values[0] / values[1])}`;
    case 'newtons-second-law':
      return `Force: ${formatNumber(values[0] * values[1])}`;
    case 'kinematics':
      return `Position: ${formatNumber(values[0] * values[2] + 0.5 * values[1] * values[2] ** 2)}`;
    case 'ideal-gas':
      return `Pressure: ${formatNumber((values[0] * 8.314 * values[1]) / values[2])}`;
    case 'wave-calculator':
      return `Wave speed: ${formatNumber(values[0] * values[1])}`;
    case 'projectile-motion':
      return `Range: ${formatNumber((values[0] ** 2 * Math.sin((2 * (values[1] * Math.PI)) / 180)) / 9.81)}\nMaximum height: ${formatNumber((values[0] ** 2 * Math.sin((values[1] * Math.PI) / 180) ** 2) / 19.62)}`;
    case 'circular-motion':
      return `Centripetal acceleration: ${formatNumber(values[0] ** 2 / values[1])}`;
    case 'mechanical-energy':
      return `Kinetic energy: ${formatNumber(0.5 * values[0] * values[1] ** 2)}\nPotential energy: ${formatNumber(values[0] * 9.81 * values[2])}`;
    case 'sensible-heat':
      return `Heat: ${formatNumber(values[0] * values[1] * values[2])}`;
    case 'dilution-calculator':
      return `Final concentration: ${formatNumber((values[0] * values[1]) / values[2])}`;
    case 'ph-calculator':
      return `pH: ${formatNumber(-Math.log10(values[0]))}`;
    case 'moles-calculator':
      return `Moles: ${formatNumber(values[0] / values[1])}`;
    case 'compound-interest':
    case 'compound-interest-calculator':
      return `Final amount: ${formatNumber(values[0] * (1 + values[1] / 100) ** values[2])}`;
    case 'roi-calculator':
      return `ROI: ${formatNumber(((values[1] - values[0]) / values[0]) * 100)}%`;
    case 'break-even-calculator':
      return `Break-even units: ${formatNumber(values[0] / (values[1] - values[2]))}`;
    case 'inflation-calculator':
      return `Adjusted value: ${formatNumber(values[0] * (1 + values[1] / 100) ** values[2])}`;
    case 'amortization-calculator':
    case 'loan-interest-calculator': {
      const [principal, annualRate, payments] = values;

      const rate = annualRate / 100 / 12;

      return `Monthly payment: ${formatNumber((principal * rate * (1 + rate) ** payments) / ((1 + rate) ** payments - 1))}`;
    }
    case 'resistor-network':
      return `Parallel resistance: ${formatNumber(1 / values.reduce((sum, value) => sum + 1 / value, 0))}`;
    case 'molar-mass':
      return `Input formula: ${input}`;
    case 'composition-calculator':
      return `Percentage: ${formatNumber((values[0] / values[1]) * 100)}%`;
    case 'sequences':
      return Array.from({ length: Math.min(50, Math.max(1, values[2] || 10)) }, (_, index) =>
        formatNumber((values[0] || 0) + (values[1] || 1) * index),
      ).join(', ');
    case 'linear-systems':
    case 'linear-system-2x2': {
      const [a, b, c, d, e, f] = values;

      const determinant = a * e - b * d;

      return determinant
        ? `x = ${formatNumber((c * e - b * f) / determinant)}\ny = ${formatNumber((a * f - c * d) / determinant)}`
        : 'No unique solution';
    }
    case 'linear-system-3x3': {
      const matrix = [values.slice(0, 4), values.slice(4, 8), values.slice(8, 12)];

      for (let column = 0; column < 3; column += 1) {
        const pivot = matrix.findIndex((row, index) => index >= column && row[column] !== 0);

        if (pivot < 0) return 'No unique solution';
        [matrix[column], matrix[pivot]] = [matrix[pivot], matrix[column]];

        const divisor = matrix[column][column];

        matrix[column] = matrix[column].map((value) => value / divisor);
        for (let row = 0; row < 3; row += 1) {
          if (row === column) continue;

          const factor = matrix[row][column];

          matrix[row] = matrix[row].map((value, index) => value - factor * matrix[column][index]);
        }
      }
      return matrix.map((row, index) => `x${index + 1} = ${formatNumber(row[3])}`).join('\n');
    }
    case 'matrix-calculator': {
      const size = Math.sqrt(values.length);

      if (!Number.isInteger(size)) return 'Enter a square matrix as comma-separated values.';
      return Array.from({ length: size }, (_, row) =>
        values.slice(row * size, (row + 1) * size).join('  '),
      ).join('\n');
    }
    case 'vector-calculator': {
      const [first, secondVector] = input.split(';').map((part) => numbers(part));

      if (!first?.length || !secondVector?.length)
        return 'Enter two vectors separated by a semicolon.';
      return `Sum: ${first.map((value, index) => formatNumber(value + (secondVector[index] || 0))).join(', ')}\nDot product: ${formatNumber(first.reduce((sum, value, index) => sum + value * (secondVector[index] || 0), 0))}`;
    }
    case 'correlation-calculator':
    case 'linear-regression': {
      const [x, y] = input.split(';').map((part) => numbers(part));

      if (!x?.length || !y?.length || x.length !== y.length)
        return 'Enter two equally sized series separated by a semicolon.';

      const mean = (items: number[]) => items.reduce((sum, item) => sum + item, 0) / items.length;

      const xMean = mean(x),
        yMean = mean(y);

      const numerator = x.reduce(
        (sum, value, index) => sum + (value - xMean) * (y[index] - yMean),
        0,
      );

      const denominator = Math.sqrt(
        x.reduce((sum, value) => sum + (value - xMean) ** 2, 0) *
          y.reduce((sum, value) => sum + (value - yMean) ** 2, 0),
      );

      return slug === 'linear-regression'
        ? `y = ${formatNumber(numerator / x.reduce((sum, value) => sum + (value - xMean) ** 2, 0))}x + ${formatNumber(yMean - (numerator / x.reduce((sum, value) => sum + (value - xMean) ** 2, 0)) * xMean)}`
        : `Correlation: ${formatNumber(numerator / denominator)}`;
    }
    case 'normal-distribution': {
      const [mean = 0, deviation = 1, value = 0] = values;

      return formatNumber(
        (1 / (deviation * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * ((value - mean) / deviation) ** 2),
      );
    }
    case 'complex-number-calculator': {
      const [a, b, c, d] = values;

      return `Sum: ${formatNumber(a + c)} ${formatNumber(b + d)}i\nProduct: ${formatNumber(a * c - b * d)} ${formatNumber(a * d + b * c)}i`;
    }
    case 'unit-converter':
      return `${formatNumber(values[0])} m = ${formatNumber(values[0] * 3.28084)} ft = ${formatNumber(values[0] * 100)} cm`;
    case 'number-theory':
      return `Prime factors: ${primeFactors(values[0])}\nParity: ${values[0] % 2 === 0 ? 'even' : 'odd'}`;
    case 'function-plotter':
      return 'Enter a function expression to generate a plot in the browser.';
    case 'statistics':
    case 'statistics-analyzer': {
      const ordered = [...values].sort((a, b) => a - b);

      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

      const middle = Math.floor(ordered.length / 2);

      const median =
        ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;

      return `Mean: ${formatNumber(mean)}\nMedian: ${formatNumber(median)}\nMinimum: ${formatNumber(ordered[0])}\nMaximum: ${formatNumber(ordered.at(-1) ?? 0)}`;
    }
    default:
      return `Values: ${[input, second, third].filter(Boolean).join(' · ')}`;
  }
}
