<?php

namespace App\Content;

use App\Models\CreditEntry;
use Illuminate\Support\Collection;

class CreditsQuery
{
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
}
