<?php

namespace App\Http\Controllers\Concerns;

use App\Models\AuditLog;
use Illuminate\Http\Request;

trait BuildsVersionHistory
{
    protected function buildVersionHistory(string $auditableType, int $auditableId, array $fields, Request $request): ?array
    {
        $entries = AuditLog::query()
            ->where('auditable_type', $auditableType)
            ->where('auditable_id', $auditableId)
            ->where('action', 'updated')
            ->orderBy('created_at')
            ->get();

        if ($entries->isEmpty()) {
            return null;
        }

        $versions = collect();
        $versions->push(array_merge(
            [
                'id' => 'original',
                'label' => __('pages.history_original'),
            ],
            collect($fields)->mapWithKeys(fn ($field) => [$field => $entries->first()->old_values[$field] ?? null])->all()
        ));

        foreach ($entries as $entry) {
            $versions->push(array_merge(
                [
                    'id' => (string) $entry->id,
                    'label' => $entry->created_at?->format('Y-m-d H:i'),
                ],
                collect($fields)->mapWithKeys(fn ($field) => [$field => $entry->new_values[$field] ?? null])->all()
            ));
        }

        $compareParam = $request->query('compare', '');
        $compareIds = is_array($compareParam)
            ? array_filter($compareParam)
            : array_filter(explode(',', (string) $compareParam));
        $compareIds = array_values($compareIds);

        $fromId = $compareIds[0] ?? $versions->first()['id'];
        $toId = $compareIds[1] ?? $versions->last()['id'];

        return [
            'versions' => $versions,
            'from' => $versions->firstWhere('id', $fromId) ?? $versions->first(),
            'to' => $versions->firstWhere('id', $toId) ?? $versions->last(),
        ];
    }
}
