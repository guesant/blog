<?php

namespace App\Content;

class ToolRegistry
{
    private const TOOLS = [
        ['slug' => 'text-case', 'category' => 'text'],
        ['slug' => 'image-resizer', 'category' => 'image'],
        ['slug' => 'json-formatter', 'category' => 'code'],
        ['slug' => 'base64-encoder', 'category' => 'code'],
        ['slug' => 'url-encoder', 'category' => 'code'],
        ['slug' => 'case-style-converter', 'category' => 'code'],
        ['slug' => 'cipher-tool', 'category' => 'code'],
        ['slug' => 'hash-generator', 'category' => 'code'],
        ['slug' => 'jwt-decoder', 'category' => 'code'],
        ['slug' => 'uuid-generator', 'category' => 'generators'],
        ['slug' => 'password-generator', 'category' => 'generators'],
        ['slug' => 'qr-code-generator', 'category' => 'generators'],
        ['slug' => 'text-counter', 'category' => 'text'],
        ['slug' => 'regex-tester', 'category' => 'dev'],
        ['slug' => 'markdown-to-html', 'category' => 'dev'],
        ['slug' => 'timestamp-converter', 'category' => 'dev'],
        ['slug' => 'color-converter', 'category' => 'design'],
        ['slug' => 'duplicate-line-remover', 'category' => 'text'],
        ['slug' => 'duplicate-word-finder', 'category' => 'text'],
        ['slug' => 'line-break-remover', 'category' => 'text'],
        ['slug' => 'whitespace-trimmer', 'category' => 'text'],
        ['slug' => 'find-and-replace', 'category' => 'text'],
        ['slug' => 'text-repeater', 'category' => 'text'],
        ['slug' => 'palindrome-checker', 'category' => 'text'],
        ['slug' => 'word-frequency-counter', 'category' => 'text'],
        ['slug' => 'nato-phonetic-alphabet', 'category' => 'text'],
        ['slug' => 'roman-numeral-converter', 'category' => 'text'],
        ['slug' => 'text-reverser', 'category' => 'text'],
        ['slug' => 'line-sorter', 'category' => 'text'],
        ['slug' => 'accent-remover', 'category' => 'text'],
        ['slug' => 'slugify', 'category' => 'text'],
        ['slug' => 'lorem-ipsum-generator', 'category' => 'text'],
        ['slug' => 'invisible-char-remover', 'category' => 'text'],
        ['slug' => 'pig-latin', 'category' => 'text'],
        ['slug' => 'leetspeak', 'category' => 'text'],
        ['slug' => 'reading-time-estimator', 'category' => 'text'],
        ['slug' => 'vigenere-cipher', 'category' => 'text'],
        ['slug' => 'json-to-csv', 'category' => 'code'],
        ['slug' => 'markdown-table-generator', 'category' => 'code'],
        ['slug' => 'html-entity-codec', 'category' => 'code'],
        ['slug' => 'utf8-inspector', 'category' => 'code'],
        ['slug' => 'hex-text-codec', 'category' => 'code'],
        ['slug' => 'binary-text-codec', 'category' => 'code'],
        ['slug' => 'morse-code-translator', 'category' => 'code'],
        ['slug' => 'query-string-parser', 'category' => 'code'],
        ['slug' => 'env-file-validator', 'category' => 'code'],
        ['slug' => 'number-base-converter', 'category' => 'code'],
        ['slug' => 'dot-case-converter', 'category' => 'code'],
        ['slug' => 'random-number-generator', 'category' => 'generators'],
        ['slug' => 'random-string-generator', 'category' => 'generators'],
        ['slug' => 'random-color-palette', 'category' => 'generators'],
        ['slug' => 'random-date-generator', 'category' => 'generators'],
        ['slug' => 'fake-name-generator', 'category' => 'generators'],
        ['slug' => 'css-gradient-generator', 'category' => 'generators'],
        ['slug' => 'css-box-shadow-generator', 'category' => 'generators'],
        ['slug' => 'css-border-radius-generator', 'category' => 'generators'],
        ['slug' => 'css-clamp-calculator', 'category' => 'generators'],
        ['slug' => 'contrast-checker', 'category' => 'design'],
        ['slug' => 'colorblindness-simulator', 'category' => 'design'],
        ['slug' => 'percentage-calculator', 'category' => 'math'],
        ['slug' => 'gcd-lcm-calculator', 'category' => 'math'],
        ['slug' => 'prime-factorization', 'category' => 'math'],
        ['slug' => 'unit-converter', 'category' => 'math'],
        ['slug' => 'bmi-calculator', 'category' => 'math'],
        ['slug' => 'age-calculator', 'category' => 'math'],
        ['slug' => 'date-difference-calculator', 'category' => 'math'],
        ['slug' => 'loan-interest-calculator', 'category' => 'finance'],
        ['slug' => 'image-format-converter', 'category' => 'image'],
        ['slug' => 'image-compressor', 'category' => 'image'],
        ['slug' => 'image-to-base64', 'category' => 'image'],
        ['slug' => 'image-color-picker', 'category' => 'image'],
        ['slug' => 'image-dimension-calculator', 'category' => 'image'],
        ['slug' => 'svg-to-png', 'category' => 'image'],
        ['slug' => 'robots-txt-generator', 'category' => 'dev'],
        ['slug' => 'gitignore-generator', 'category' => 'dev'],
        ['slug' => 'http-status-reference', 'category' => 'dev'],
        ['slug' => 'user-agent-parser', 'category' => 'dev'],
        ['slug' => 'viewport-info', 'category' => 'dev'],
        ['slug' => 'color-wheel', 'category' => 'design'],
        ['slug' => 'uwu-speak', 'category' => 'text'],
        ['slug' => 'quadratic-equation', 'category' => 'math'],
        ['slug' => 'linear-system-2x2', 'category' => 'math'],
        ['slug' => 'statistics-analyzer', 'category' => 'statistics'],
        ['slug' => 'projectile-motion', 'category' => 'physics'],
        ['slug' => 'ohms-law', 'category' => 'engineering'],
        ['slug' => 'molar-mass', 'category' => 'chemistry'],
        ['slug' => 'csv-chart', 'category' => 'statistics'],
        ['slug' => 'periodic-table', 'category' => 'chemistry'],
        ['slug' => 'fraction-calculator', 'category' => 'math'],
        ['slug' => 'normal-distribution', 'category' => 'statistics'],
        ['slug' => 'chemical-equation-balancer', 'category' => 'chemistry'],
        ['slug' => 'arithmetic-progression', 'category' => 'math'],
        ['slug' => 'linear-system-3x3', 'category' => 'math'],
        ['slug' => 'geometric-progression', 'category' => 'math'],
        ['slug' => 'linear-regression', 'category' => 'statistics'],
        ['slug' => 'triangle-calculator', 'category' => 'math'],
        ['slug' => 'kinematics', 'category' => 'physics'],
        ['slug' => 'newtons-second-law', 'category' => 'physics'],
        ['slug' => 'ideal-gas', 'category' => 'physics'],
        ['slug' => 'wave-calculator', 'category' => 'physics'],
        ['slug' => 'mechanical-energy', 'category' => 'physics'],
        ['slug' => 'resistor-network', 'category' => 'engineering'],
        ['slug' => 'sensible-heat', 'category' => 'physics'],
        ['slug' => 'dilution-calculator', 'category' => 'chemistry'],
        ['slug' => 'matrix-calculator', 'category' => 'math'],
        ['slug' => 'vector-calculator', 'category' => 'math'],
        ['slug' => 'function-plotter', 'category' => 'math'],
        ['slug' => 'flowchart-builder', 'category' => 'engineering'],
        ['slug' => 'table-editor', 'category' => 'statistics'],
        ['slug' => 'correlation-calculator', 'category' => 'statistics'],
        ['slug' => 'compound-interest-calculator', 'category' => 'finance'],
        ['slug' => 'ph-calculator', 'category' => 'chemistry'],
        ['slug' => 'amortization-calculator', 'category' => 'finance'],
        ['slug' => 'circular-motion', 'category' => 'physics'],
        ['slug' => 'composition-calculator', 'category' => 'chemistry'],
        ['slug' => 'data-cleaner', 'category' => 'statistics'],
        ['slug' => 'complex-number-calculator', 'category' => 'math'],
    ];

    public static function all(): array
    {
        return self::TOOLS;
    }

    public static function find(string $slug): ?array
    {
        foreach (self::TOOLS as $tool) {
            if ($tool['slug'] === $slug) {
                return $tool;
            }
        }

        return null;
    }

    public static function exists(string $slug): bool
    {
        return self::find($slug) !== null;
    }
}
