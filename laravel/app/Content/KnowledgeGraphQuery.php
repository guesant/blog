<?php

namespace App\Content;

use App\Content\Graph\NodeRegistry;
use App\Models\ContentRelation;
use App\Models\RelationType;
use App\Models\Topic;
use Illuminate\Support\Facades\DB;

class KnowledgeGraphQuery
{
    private const KIND_COLORS = [
        'topic' => '#1d4ed8',
        'finding' => '#1a1a1a',
        'technology' => '#0f766e',
        'writing' => '#b45309',
        'case-study' => '#7c3aed',
        'project' => '#0369a1',
        'experiment' => '#be123c',
        'snippet' => '#4d7c0f',
        'collection' => '#a16207',
    ];

    public function build(?string $locale = null): array
    {
        $locale = Locale::normalize($locale);

        $nodes = [];
        $index = [];

        foreach (NodeRegistry::kinds() as $kind => $class) {
            $models = $class::graphNodesQuery()->get();
            $alias = (new $class)->getMorphClass();

            foreach ($models as $model) {
                $graphId = $model->graphId();
                $nodes[] = [
                    'id' => $graphId,
                    'kind' => $kind,
                    'label' => $model->graphLabel($locale),
                    'url' => $model->graphUrl($locale),
                    'meta' => $model->graphMeta(),
                ];
                $index[$alias.':'.$model->getKey()] = $graphId;
            }
        }

        $edges = [
            ...$this->topicEdges($index, $locale),
            ...$this->technologyEdges($index, $locale),
            ...$this->collectionEdges($index, $locale),
            ...$this->contentRelationEdges($index, $locale),
        ];

        return [
            'nodes' => $nodes,
            'edges' => $edges,
            'kinds' => $this->presentKinds($nodes, $locale),
        ];
    }

    private function topicEdges(array $index, string $locale): array
    {
        $hasTopicLabel = __('knowledge_map.has_topic', [], $locale);
        $topicAlias = NodeRegistry::kindFor(Topic::class);

        $edges = [];
        foreach (DB::table('topicables')->get() as $row) {
            $topicGraphId = $index[$topicAlias.':'.$row->topic_id] ?? null;
            $subjectGraphId = $index[$row->topicable_type.':'.$row->topicable_id] ?? null;

            if (! $topicGraphId || ! $subjectGraphId) {
                continue;
            }

            $role = $row->role ?? null;
            $label = ($role && $role !== 'primary') ? "{$hasTopicLabel} ({$role})" : $hasTopicLabel;

            $edges[] = [
                'source' => $subjectGraphId,
                'target' => $topicGraphId,
                'relationType' => 'has-topic',
                'label' => $label,
            ];
        }

        return $edges;
    }

    private function technologyEdges(array $index, string $locale): array
    {
        $usesLabel = __('knowledge_map.uses', [], $locale);
        $pivots = [
            'case-study' => ['table' => 'case_study_technology', 'column' => 'case_study_id'],
            'project' => ['table' => 'project_technology', 'column' => 'project_id'],
            'experiment' => ['table' => 'experiment_technology', 'column' => 'experiment_id'],
        ];

        $edges = [];
        foreach ($pivots as $kind => $pivot) {
            foreach (DB::table($pivot['table'])->get() as $row) {
                $sourceGraphId = $index[$kind.':'.$row->{$pivot['column']}] ?? null;
                $targetGraphId = $index['technology:'.$row->technology_id] ?? null;

                if (! $sourceGraphId || ! $targetGraphId) {
                    continue;
                }

                $edges[] = [
                    'source' => $sourceGraphId,
                    'target' => $targetGraphId,
                    'relationType' => 'uses',
                    'label' => $usesLabel,
                ];
            }
        }

        return $edges;
    }

    private function collectionEdges(array $index, string $locale): array
    {
        $containsLabel = __('knowledge_map.contains', [], $locale);

        $edges = [];
        foreach (DB::table('reference_collection_item')->get() as $row) {
            $sourceGraphId = $index['collection:'.$row->reference_collection_id] ?? null;
            $targetGraphId = $index['finding:'.$row->resource_id] ?? null;

            if (! $sourceGraphId || ! $targetGraphId) {
                continue;
            }

            $edges[] = [
                'source' => $sourceGraphId,
                'target' => $targetGraphId,
                'relationType' => 'contains',
                'label' => $containsLabel,
            ];
        }

        return $edges;
    }

    private function contentRelationEdges(array $index, string $locale): array
    {
        $edges = [];
        foreach (ContentRelation::with('relationType')->get() as $relation) {
            if (! $relation->relationType) {
                continue;
            }

            if ($relation->visibility !== null && $relation->visibility !== 'public') {
                continue;
            }

            $sourceGraphId = $index[$relation->subject_type.':'.$relation->subject_id] ?? null;
            $targetGraphId = $index[$relation->object_type.':'.$relation->object_id] ?? null;

            if (! $sourceGraphId || ! $targetGraphId) {
                continue;
            }

            $edges[] = [
                'source' => $sourceGraphId,
                'target' => $targetGraphId,
                'relationType' => $relation->relationType->key,
                'label' => $this->relationLabel($relation->relationType, $locale),
            ];
        }

        return $edges;
    }

    private function relationLabel(RelationType $relationType, string $locale): string
    {
        $suffix = $locale === 'pt-BR' ? 'pt_br' : 'en';

        return $relationType->{"outbound_label_{$suffix}"} ?? $relationType->key;
    }

    private function presentKinds(array $nodes, string $locale): array
    {
        $present = collect($nodes)->pluck('kind')->unique();

        $kinds = [];
        foreach (NodeRegistry::kinds() as $kind => $class) {
            if (! $present->contains($kind)) {
                continue;
            }

            $kinds[$kind] = [
                'label' => __("knowledge_map.kinds.{$kind}", [], $locale),
                'color' => self::KIND_COLORS[$kind] ?? '#6b6b6b',
            ];
        }

        return $kinds;
    }
}
