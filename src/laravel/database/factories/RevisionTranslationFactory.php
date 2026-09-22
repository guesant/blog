<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

abstract class RevisionTranslationFactory extends Factory
{
    protected string $identityClass;

    protected string $revisionClass;

    protected string $identityKey;

    protected string $revisionKey;

    protected array $revisionColumns = [];

    public function configure(): static
    {
        return $this->afterMaking(function (Model $translation): void {
            $identityId = $translation->getAttribute($this->identityKey);
            if ($identityId === null) {
                return;
            }

            $identity = $this->identityClass::query()->findOrFail($identityId);
            $revisionId = $identity->current_revision_id;

            if ($revisionId === null) {
                $revision = $this->revisionClass::query()->create([
                    $this->identityKey => $identity->getKey(),
                    'revision_number' => 1,
                    ...array_intersect_key(
                        $identity->getAttributes(),
                        array_fill_keys($this->revisionColumns, true),
                    ),
                ]);
                $identity->forceFill([
                    'current_revision_id' => $revision->getKey(),
                    'published_revision_id' => $revision->getKey(),
                ])->saveQuietly();
                $revisionId = $revision->getKey();
            }

            $translation->setAttribute($this->revisionKey, $revisionId);
            $translation->offsetUnset($this->identityKey);
        });
    }
}
