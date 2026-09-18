<?php

namespace App\Content\Concerns;

use Illuminate\Database\Eloquent\Builder;

/**
 * Shared "asc/desc by a column, alpha by the current locale's translated
 * title/name, otherwise fall back to a default order column" resolution
 * used by every Query class's paginated listing methods.
 */
trait SortsListings
{
    /**
     * @param  Builder<*>  $query
     */
    private function applySort(
        Builder $query,
        ?string $sort,
        string $sortColumn = 'created_at',
        string $defaultColumn = 'order',
        ?string $alphaTable = null,
        ?string $alphaForeignKey = null,
        string $alphaColumn = 'title',
    ): void {
        if ($sort === 'asc' || $sort === 'desc') {
            $query->orderBy($sortColumn, $sort);

            return;
        }

        if ($sort === 'alpha' && $alphaTable !== null && $alphaForeignKey !== null) {
            $this->applyAlphaSort($query, $alphaTable, $alphaForeignKey, $alphaColumn);

            return;
        }

        $query->orderBy($defaultColumn);
    }

    /**
     * Orders by the current locale's translated title/name via a left join
     * on the translation table, keeping the query DB-driven (and therefore
     * paginator-safe) instead of sorting an already-fetched page in PHP.
     *
     * @param  Builder<*>  $query
     */
    private function applyAlphaSort(Builder $query, string $translationTable, string $foreignKey, string $column): void
    {
        $baseTable = $query->getModel()->getTable();
        $locale = app()->getLocale();

        if (is_null($query->getQuery()->columns)) {
            $query->select("{$baseTable}.*");
        }

        $query->leftJoin($translationTable, function ($join) use ($baseTable, $translationTable, $foreignKey, $locale) {
            $join->on("{$baseTable}.id", '=', "{$translationTable}.{$foreignKey}")
                ->where("{$translationTable}.locale", $locale);
        })->orderByRaw("lower({$translationTable}.{$column}) asc");
    }
}
