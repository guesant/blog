<?php

namespace Database\Seeders;

use App\Models\RelationType;
use Illuminate\Database\Seeder;

class RelationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = $this->resolvePath();

        if ($path === null) {
            $this->command->error('relationTypes.json not found in any known migration-snapshot location');

            return;
        }

        $data = json_decode(file_get_contents($path), true);

        if (! isset($data['definitions']) || ! is_array($data['definitions'])) {
            $this->command->info('Invalid relationTypes.json format');

            return;
        }

        foreach ($data['definitions'] as $id => $definition) {
            RelationType::updateOrCreate(
                ['key' => $id],
                [
                    'key' => $id,
                    'family' => $definition['family'] ?? '',
                    'symmetric' => $definition['symmetric'] ?? false,
                    'outbound_label_en' => $definition['outboundLabel']['en'] ?? '',
                    'outbound_label_pt_br' => $definition['outboundLabel']['ptBR'] ?? '',
                    'inbound_label_en' => $definition['inboundLabel']['en'] ?? '',
                    'inbound_label_pt_br' => $definition['inboundLabel']['ptBR'] ?? '',
                ]
            );
        }

        $this->command->info('RelationTypes seeded successfully');
    }

    private function resolvePath(): ?string
    {
        $candidates = [
            base_path('../migration-snapshot/relationTypes.json'),
            '/migration-snapshot/relationTypes.json',
        ];

        foreach ($candidates as $candidate) {
            if (file_exists($candidate)) {
                return $candidate;
            }
        }

        return null;
    }
}
