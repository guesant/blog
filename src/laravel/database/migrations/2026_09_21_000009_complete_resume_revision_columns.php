<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->addColumns('resume_revision_certificates', ['credential_id']);
        $this->addColumns('resume_revision_certifications', ['credential_id']);
        $this->addColumns('resume_revision_publications', ['name', 'issuer']);
        $this->addColumns('resume_revision_recommendations', ['author', 'quote']);
        $this->addColumns('resume_revision_events', ['talk_title', 'url']);
        $this->backfillAliases();
    }

    public function down(): void
    {
        $this->dropColumns('resume_revision_certificates', ['credential_id']);
        $this->dropColumns('resume_revision_certifications', ['credential_id']);
        $this->dropColumns('resume_revision_publications', ['name', 'issuer']);
        $this->dropColumns('resume_revision_recommendations', ['author', 'quote']);
        $this->dropColumns('resume_revision_events', ['talk_title', 'url']);
    }

    private function addColumns(string $tableName, array $columns): void
    {
        Schema::table($tableName, function (Blueprint $table) use ($tableName, $columns): void {
            foreach ($columns as $column) {
                if (! Schema::hasColumn($tableName, $column)) {
                    $table->text($column)->nullable();
                }
            }
        });
    }

    private function dropColumns(string $tableName, array $columns): void
    {
        $existing = array_values(array_filter($columns, fn (string $column): bool => Schema::hasColumn($tableName, $column)));
        if ($existing === []) {
            return;
        }

        Schema::table($tableName, function (Blueprint $table) use ($existing): void {
            $table->dropColumn($existing);
        });
    }

    private function backfillAliases(): void
    {
        DB::table('resume_translations')->orderBy('id')->each(function (object $legacy): void {
            $translationId = DB::table('resume_revision_translations')
                ->where('locale', $legacy->locale)
                ->whereIn('resume_revision_id', function ($query) use ($legacy): void {
                    $query->select('id')->from('resume_revisions')->where('resume_id', $legacy->resume_id)->where('revision_number', 1);
                })
                ->value('id');
            if ($translationId === null) {
                return;
            }

            $aliases = [
                'certificates' => ['credential_id' => 'credentialId'],
                'certifications' => ['credential_id' => 'credentialId'],
                'publications' => ['name' => 'name', 'issuer' => 'issuer'],
                'recommendations' => ['author' => 'author', 'quote' => 'quote'],
                'events' => ['talk_title' => 'talkTitle', 'url' => 'url'],
            ];

            foreach ($aliases as $kind => $columns) {
                foreach ($this->decode($legacy->{$kind} ?? null) as $order => $item) {
                    $data = [];
                    foreach ($columns as $column => $source) {
                        $data[$column] = $item[$source] ?? null;
                    }
                    DB::table('resume_revision_'.$kind)
                        ->where('resume_revision_translation_id', $translationId)
                        ->where('sort_order', $order)
                        ->update($data);
                }
            }
        });
    }

    private function decode(mixed $value): array
    {
        if (! is_string($value) || trim($value) === '') {
            return [];
        }

        $decoded = json_decode($value, true);

        return is_array($decoded) ? $decoded : [];
    }
};
