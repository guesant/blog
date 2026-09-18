<?php

namespace App\Support;

class ToolIcon
{
    private const MAP = [
        'text-case' => 'pen-line',
        'image-resizer' => 'maximize',
        'json-formatter' => 'file-text',
        'base64-encoder' => 'languages',
        'url-encoder' => 'globe',
        'case-style-converter' => 'list',
        'cipher-tool' => 'translate',
        'hash-generator' => 'hash-straight',
        'jwt-decoder' => 'identification-badge',
        'uuid-generator' => 'copy-simple',
        'password-generator' => 'sparkles',
        'qr-code-generator' => 'barcode',
        'text-counter' => 'activity',
        'regex-tester' => 'search',
        'markdown-to-html' => 'file-text',
        'timestamp-converter' => 'clock',
        'color-converter' => 'star',
        'duplicate-line-remover' => 'layout-list',
        'duplicate-word-finder' => 'hash-straight',
        'line-break-remover' => 'more-horizontal',
        'whitespace-trimmer' => 'wrench',
        'find-and-replace' => 'search',
        'text-repeater' => 'copy',
        'palindrome-checker' => 'check',
        'word-frequency-counter' => 'list',
        'nato-phonetic-alphabet' => 'languages',
        'roman-numeral-converter' => 'translate',
        'text-reverser' => 'arrow-left',
        'line-sorter' => 'chevron-down',
        'accent-remover' => 'x',
        'slugify' => 'external-link',
        'lorem-ipsum-generator' => 'file-text',
        'invisible-char-remover' => 'x',
        'pig-latin' => 'languages',
        'leetspeak' => 'hash-straight',
        'reading-time-estimator' => 'clock',
        'vigenere-cipher' => 'translate',
        'json-to-csv' => 'layout-list',
        'markdown-table-generator' => 'layout-grid',
        'html-entity-codec' => 'book-open',
        'utf8-inspector' => 'search',
        'hex-text-codec' => 'hash-straight',
        'binary-text-codec' => 'activity',
        'morse-code-translator' => 'activity',
        'query-string-parser' => 'search',
        'env-file-validator' => 'file-text',
        'number-base-converter' => 'layout-list',
        'dot-case-converter' => 'more-horizontal',
        'random-number-generator' => 'hash-straight',
        'random-string-generator' => 'list',
        'random-color-palette' => 'layout-grid',
        'random-date-generator' => 'calendar',
        'fake-name-generator' => 'user',
        'css-gradient-generator' => 'blend',
        'css-box-shadow-generator' => 'layers',
        'css-border-radius-generator' => 'square-round-corner',
        'css-clamp-calculator' => 'move-horizontal',
        'contrast-checker' => 'contrast',
        'colorblindness-simulator' => 'eye',
        'percentage-calculator' => 'percent',
        'gcd-lcm-calculator' => 'divide',
        'prime-factorization' => 'sigma',
        'unit-converter' => 'ruler',
        'bmi-calculator' => 'scale',
        'age-calculator' => 'calendar',
        'date-difference-calculator' => 'calendar-blank',
        'loan-interest-calculator' => 'percent',
        'image-format-converter' => 'translate',
        'image-compressor' => 'archive',
        'image-to-base64' => 'languages',
        'image-color-picker' => 'star',
        'image-dimension-calculator' => 'maximize',
        'svg-to-png' => 'download',
        'robots-txt-generator' => 'globe',
        'gitignore-generator' => 'git-branch',
        'http-status-reference' => 'layout-list',
        'user-agent-parser' => 'user',
        'viewport-info' => 'layout-grid',
        'color-wheel' => 'palette',
        'uwu-speak' => 'sparkles',
    ];

    private const PHOSPHOR = ['barcode', 'translate', 'hash-straight', 'identification-badge', 'copy-simple', 'clock', 'wrench', 'calendar', 'calendar-blank'];

    public static function for(string $slug): ?array
    {
        $name = self::MAP[$slug] ?? null;

        if (! $name) {
            return null;
        }

        return [
            'name' => $name,
            'set' => in_array($name, self::PHOSPHOR, true) ? 'phosphor' : 'lucide',
        ];
    }
}
