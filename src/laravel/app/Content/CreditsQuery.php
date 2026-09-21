<?php

namespace App\Content;

use App\Content\Concerns\SortsListings;
use App\Models\CreditEntry;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CreditsQuery
{
    use SortsListings;

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = CreditEntry::where('active', true)
            ->with('translations');

        $this->applySort($query, $sort, sortColumn: 'created_at', defaultColumn: 'order');

        return $query->paginate($perPage);
    }
}
