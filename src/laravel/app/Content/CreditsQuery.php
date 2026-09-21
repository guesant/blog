<?php

namespace App\Content;

use App\Content\Concerns\SortsListings;
use App\Models\CreditEntry;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CreditsQuery
{
    use SortsListings;

    public function list(?string $sort = null): Collection
    {
        $query = CreditEntry::where('active', true)
            ->with('translations');

        if ($sort === 'asc' || $sort === 'desc') {
            $query->orderBy('created_at', $sort);
        } else {
            $query->orderBy('category')->orderBy('order')->orderBy('id');
        }

        return $query->get();
    }

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = CreditEntry::where('active', true)
            ->with('translations');

        $this->applySort($query, $sort, sortColumn: 'created_at', defaultColumn: 'order');

        return $query->paginate($perPage);
    }
}
