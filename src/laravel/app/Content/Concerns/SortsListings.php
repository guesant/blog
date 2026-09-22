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
        ?string $locale = null,
    ): void {
        if ($sort === 'asc' || $sort === 'desc') {
            $query->orderBy($sortColumn, $sort)->orderBy($query->getModel()->getTable().'.id');

            return;
        }

        if ($sort === 'alpha' && $alphaTable !== null && $alphaForeignKey !== null) {
            $this->applyAlphaSort($query, $alphaTable, $alphaForeignKey, $alphaColumn, $locale);

            return;
        }

        $query->orderBy($defaultColumn)->orderBy($query->getModel()->getTable().'.id');
    }

    /**
     * Orders by the current locale's translated title/name via a left join
     * on the translation table, keeping the query DB-driven (and therefore
     * paginator-safe) instead of sorting an already-fetched page in PHP.
     *
     * @param  Builder<*>  $query
     */
    private function applyAlphaSort(Builder $query, string $translationTable, string $foreignKey, string $column, ?string $locale = null): void
    {
        $baseTable = $query->getModel()->getTable();
        $locale ??= app()->getLocale();

        if (is_null($query->getQuery()->columns)) {
            $query->select("{$baseTable}.*");
        }

        $revisionTable = str_replace('_revision_translations', '_revisions', $translationTable);

        $query->leftJoin($revisionTable, "{$baseTable}.current_revision_id", '=', "{$revisionTable}.id")
            ->leftJoin($translationTable, function ($join) use ($revisionTable, $translationTable, $foreignKey, $locale) {
                $join->on("{$revisionTable}.id", '=', "{$translationTable}.{$foreignKey}")
                    ->where("{$translationTable}.locale", $locale);
            })->orderByRaw("lower({$translationTable}.{$column}) asc")
            ->orderBy("{$baseTable}.id");
    }
}
