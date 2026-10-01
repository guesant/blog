<?php

namespace App\ReadModel\PublicSite\Content;

use App\Content\Concerns\SortsListings;
use App\Models\CreditEntry;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CreditsReader
{
    use SortsListings;

    public function listPaginated(int $perPage = 50, ?string $sort = null): LengthAwarePaginator
    {
        $query = CreditEntry::query()
            ->published()
            ->whereHas('publishedRevision', static fn ($revision) => $revision->where('active', true))
            ->whereExists(function ($category): void {
                $category
                    ->selectRaw('1')
                    ->from('credit_categories')
                    ->whereColumn('credit_categories.slug', 'credit_entries.category')
                    ->where('credit_categories.active', true);
            })
            ->with('publishedTranslations');

        $this->applySort($query, $sort, sortColumn: 'created_at', defaultColumn: 'order');

        return $query->paginate($perPage);
    }
}
