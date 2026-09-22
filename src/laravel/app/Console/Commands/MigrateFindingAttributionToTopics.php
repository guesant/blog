<?php

namespace App\Console\Commands;

use App\Models\RelationType;
use App\Models\Resource;
use App\Models\Topic;
use App\Models\TopicTranslation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MigrateFindingAttributionToTopics extends Command
{
    protected $signature = 'content:migrate-finding-attribution {--apply : Persist the changes instead of only printing a diff}';

    protected $description = 'Convert normalized finding attributions into Topic nodes linked via ContentRelation rows';

    public function handle(): int
    {
        $apply = (bool) $this->option('apply');

        $authoredBy = RelationType::where('key', 'authored-by')->firstOrFail();
        $publishedBy = RelationType::where('key', 'published-by')->firstOrFail();

        $created = ['topics' => 0, 'relations' => 0];

        DB::transaction(function () use ($apply, $authoredBy, $publishedBy, &$created) {
            foreach (Resource::with('currentRevision.attributions')->get() as $resource) {
                $this->convert($resource, 'person', $authoredBy, $apply, $created);
                $this->convert($resource, 'organization', $publishedBy, $apply, $created);
            }

            if (! $apply) {
                DB::rollBack();
            }
        });

        $this->info(sprintf(
            '%d topics, %d relations %s.',
            $created['topics'],
            $created['relations'],
            $apply ? 'created' : 'would be created — rerun with --apply to persist'
        ));

        return self::SUCCESS;
    }

    /**
     * @param  array{topics: int, relations: int}  $created
     */
    private function convert(Resource $resource, string $topicKind, RelationType $relationType, bool $apply, array &$created): void
    {
        $names = $resource->currentRevision?->attributions
            ->where('kind', $topicKind)
            ->pluck('name')
            ->map(fn (string $name): string => trim($name))
            ->filter();

        foreach ($names as $name) {
            $slug = Str::slug($name);

            $topic = Topic::where('slug', $slug)->first();

            if (! $topic) {
                $this->line("TOPIC: {$slug} ({$topicKind}) from \"{$name}\"");
                $created['topics']++;

                if ($apply) {
                    $topic = Topic::create([
                        'slug' => $slug,
                        'order' => (int) Topic::where('kind', $topicKind)->max('order') + 1,
                        'kind' => $topicKind,
                    ]);

                    foreach (['en', 'pt-BR'] as $locale) {
                        TopicTranslation::create([
                            'topic_id' => $topic->id,
                            'locale' => $locale,
                            'name' => $name,
                        ]);
                    }
                }
            }

            if (! $apply) {
                $this->line("RELATION: {$resource->slug} --{$relationType->key}--> {$slug}");
                $created['relations']++;

                continue;
            }

            $exists = DB::table('content_relations')
                ->where('relation_type_id', $relationType->id)
                ->where('subject_type', $resource->getMorphClass())
                ->where('subject_id', $resource->id)
                ->where('object_type', $topic->getMorphClass())
                ->where('object_id', $topic->id)
                ->exists();

            if (! $exists) {
                $this->line("RELATION: {$resource->slug} --{$relationType->key}--> {$slug}");
                $created['relations']++;

                DB::table('content_relations')->insert([
                    'relation_type_id' => $relationType->id,
                    'subject_type' => $resource->getMorphClass(),
                    'subject_id' => $resource->id,
                    'object_type' => $topic->getMorphClass(),
                    'object_id' => $topic->id,
                    'status' => 'verified',
                    'visibility' => 'public',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
