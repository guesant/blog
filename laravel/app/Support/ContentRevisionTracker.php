<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ContentRevisionTracker
{
    public function saved(Model $model): void
    {
        $this->bump();
    }

    public function deleted(Model $model): void
    {
        $this->bump();
    }

    private function bump(): void
    {
        $updatedAt = now();

        if (DB::table('content_revisions')->where('id', 1)->exists()) {
            DB::table('content_revisions')->where('id', 1)->update([
                'version' => DB::raw('version + 1'),
                'updated_at' => $updatedAt,
            ]);

            return;
        }

        DB::table('content_revisions')->insert([
            'id' => 1,
            'version' => 1,
            'updated_at' => $updatedAt,
        ]);
    }
}
