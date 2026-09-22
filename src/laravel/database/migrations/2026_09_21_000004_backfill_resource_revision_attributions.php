<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('resources')->orderBy('id')->each(function (object $resource): void {
            $revisionId = DB::table('resources')->where('id', $resource->id)->value('current_revision_id');
            if ($revisionId === null) {
                return;
            }

            foreach (['authors' => 'person', 'organizations' => 'organization'] as $column => $kind) {
                $values = $this->values($resource->{$column});
                foreach ($values as $order => $value) {
                    DB::table('resource_revision_attributions')->insertOrIgnore([
                        'resource_revision_id' => $revisionId,
                        'kind' => $kind,
                        'name' => $value,
                        'sort_order' => $order,
                    ]);
                }
            }
        });
    }

    public function down(): void
    {
        DB::table('resource_revision_attributions')->delete();
    }

    private function values(mixed $value): array
    {
        if (is_array($value)) {
            return array_values(array_filter($value, static fn (mixed $item): bool => is_scalar($item) && (string) $item !== ''));
        }

        if (! is_string($value) || trim($value) === '') {
            return [];
        }

        $decoded = json_decode($value, true);
        if (is_array($decoded)) {
            return $this->values($decoded);
        }

        return [trim($value)];
    }
};
