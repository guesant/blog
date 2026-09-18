<?php

namespace App\Support;

/**
 * Hand-rolled line-level diff (LCS-based, same idea as `diff -u`) for the
 * Writing version history feature. sebastian/diff would do this too, but
 * it's only pulled in as a transitive dev dependency of phpunit here (see
 * `composer show sebastian/diff` — no `require-dev` entry of its own in
 * composer.json), so it isn't guaranteed to exist once the app is
 * installed with `--no-dev`. This keeps the diff working without adding
 * a new production dependency.
 */
class LineDiff
{
    /**
     * @return array<int, array{type: string, text: string}> each entry is
     *                                                       ['type' => 'unchanged'|'added'|'removed', 'text' => string]
     */
    public static function compare(?string $old, ?string $new): array
    {
        $oldLines = static::toLines($old);
        $newLines = static::toLines($new);

        $lcs = static::longestCommonSubsequence($oldLines, $newLines);

        $result = [];
        $i = 0;
        $j = 0;
        $k = 0;

        while ($i < count($oldLines) || $j < count($newLines)) {
            if ($k < count($lcs) && $i < count($oldLines) && $j < count($newLines)
                && $oldLines[$i] === $lcs[$k] && $newLines[$j] === $lcs[$k]) {
                $result[] = ['type' => 'unchanged', 'text' => $oldLines[$i]];
                $i++;
                $j++;
                $k++;

                continue;
            }

            if ($i < count($oldLines) && (! ($k < count($lcs)) || $oldLines[$i] !== $lcs[$k])) {
                $result[] = ['type' => 'removed', 'text' => $oldLines[$i]];
                $i++;

                continue;
            }

            if ($j < count($newLines)) {
                $result[] = ['type' => 'added', 'text' => $newLines[$j]];
                $j++;
            }
        }

        return $result;
    }

    /**
     * @param  string[]  $a
     * @param  string[]  $b
     * @return string[]
     */
    protected static function longestCommonSubsequence(array $a, array $b): array
    {
        $m = count($a);
        $n = count($b);
        $table = array_fill(0, $m + 1, array_fill(0, $n + 1, 0));

        for ($i = $m - 1; $i >= 0; $i--) {
            for ($j = $n - 1; $j >= 0; $j--) {
                $table[$i][$j] = $a[$i] === $b[$j]
                    ? $table[$i + 1][$j + 1] + 1
                    : max($table[$i + 1][$j], $table[$i][$j + 1]);
            }
        }

        $lcs = [];
        $i = 0;
        $j = 0;

        while ($i < $m && $j < $n) {
            if ($a[$i] === $b[$j]) {
                $lcs[] = $a[$i];
                $i++;
                $j++;
            } elseif ($table[$i + 1][$j] >= $table[$i][$j + 1]) {
                $i++;
            } else {
                $j++;
            }
        }

        return $lcs;
    }

    /**
     * @return string[]
     */
    protected static function toLines(?string $text): array
    {
        if ($text === null || $text === '') {
            return [];
        }

        return preg_split('/\R/', $text) ?: [];
    }
}
