<?php

namespace App\Console\Commands;

use App\Models\CreditEntry;
use App\Models\CreditEntryTranslation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SyncDependencyCredits extends Command
{
    protected $signature = 'content:sync-dependency-credits {--apply : Persist the changes instead of only printing a diff}';

    protected $description = 'Discover direct project dependencies from composer.json and package.json and sync them into credit_entries';

    public function handle(): int
    {
        $apply = (bool) $this->option('apply');

        $dependencies = array_merge(
            $this->readComposerDependencies(),
            $this->readNpmDependencies(),
        );

        $dependenciesByKey = collect($dependencies)->keyBy(fn (array $dependency) => $this->key($dependency['package_manager'], $dependency['package_name']));

        $existing = CreditEntry::query()
            ->whereNotNull('package_manager')
            ->whereNotNull('package_name')
            ->get()
            ->keyBy(fn (CreditEntry $entry) => $this->key($entry->package_manager, $entry->package_name));

        $new = [];
        $toDisable = [];
        $unchanged = 0;

        foreach ($dependenciesByKey as $key => $dependency) {
            $entry = $existing->get($key);

            if (! $entry) {
                $new[] = $dependency;

                continue;
            }

            $unchanged++;
        }

        foreach ($existing as $key => $entry) {
            if (! $entry->is_automatic) {
                continue;
            }

            if ($dependenciesByKey->has($key)) {
                continue;
            }

            if (! $entry->active) {
                continue;
            }

            $toDisable[] = $entry;
        }

        foreach ($new as $dependency) {
            $this->line("NOVO: {$dependency['package_name']}");

            if ($apply) {
                $this->createEntry($dependency);
            }
        }

        foreach ($toDisable as $entry) {
            $this->line("DESABILITAR: {$entry->package_name}");

            if ($apply) {
                $entry->active = false;
                $entry->save();
            }
        }

        $this->newLine();
        $this->info(sprintf(
            '%d novos, %d a desabilitar, %d já sincronizados sem mudança.',
            count($new),
            count($toDisable),
            $unchanged,
        ));
        $this->info($apply ? 'Applied.' : 'Dry run only — rerun with --apply to persist.');

        return self::SUCCESS;
    }

    private function key(?string $packageManager, ?string $packageName): string
    {
        return "{$packageManager}:{$packageName}";
    }

    private function createEntry(array $dependency): void
    {
        $lastOrder = (int) CreditEntry::max('order');

        $entry = CreditEntry::create([
            'url' => null,
            'category' => str_starts_with($dependency['package_name'], '@fontsource') ? 'font' : 'library',
            'order' => $lastOrder + 1,
            'is_automatic' => true,
            'active' => true,
            'package_manager' => $dependency['package_manager'],
            'package_name' => $dependency['package_name'],
        ]);

        $name = $dependency['package_name'];
        $description = $dependency['description'] ?? $dependency['license'] ?? $name;

        foreach (['en', 'pt-BR'] as $locale) {
            CreditEntryTranslation::create([
                'credit_entry_id' => $entry->id,
                'locale' => $locale,
                'name' => $name,
                'description' => $description,
            ]);
        }
    }

    /**
     * Only the dependencies this project directly chose (composer.json's
     * require/require-dev), not the full transitive tree from
     * composer.lock — crediting every indirect package (symfony/polyfill-*,
     * etc.) would bury the handful of libraries actually worth naming.
     * composer.lock is still consulted, just to pull license/description
     * for the packages we do keep.
     *
     * @return array<int, array{package_manager: string, package_name: string, license: ?string, description: ?string}>
     */
    private function readComposerDependencies(): array
    {
        $manifestPath = base_path('composer.json');

        if (! File::exists($manifestPath)) {
            return [];
        }

        $manifest = json_decode(File::get($manifestPath), true) ?? [];

        $names = collect(['require', 'require-dev'])
            ->flatMap(fn (string $section) => array_keys($manifest[$section] ?? []))
            ->reject(fn (string $name) => $name === 'php' || str_starts_with($name, 'ext-'))
            ->unique()
            ->values();

        $lockPath = base_path('composer.lock');
        $lockedByName = [];

        if (File::exists($lockPath)) {
            $lock = json_decode(File::get($lockPath), true) ?? [];
            $lockedByName = collect(array_merge($lock['packages'] ?? [], $lock['packages-dev'] ?? []))
                ->keyBy('name')
                ->all();
        }

        return $names
            ->map(function (string $name) use ($lockedByName) {
                $locked = $lockedByName[$name] ?? null;
                $license = $locked['license'] ?? null;
                $license = is_array($license) ? implode(', ', $license) : $license;

                return [
                    'package_manager' => 'composer',
                    'package_name' => $name,
                    'license' => $license,
                    'description' => $locked['description'] ?? null,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{package_manager: string, package_name: string, license: ?string, description: ?string}>
     */
    private function readNpmDependencies(): array
    {
        $path = base_path('package.json');

        if (! File::exists($path)) {
            return [];
        }

        $manifest = json_decode(File::get($path), true) ?? [];

        $names = collect(['dependencies', 'devDependencies', 'optionalDependencies'])
            ->flatMap(fn (string $section) => array_keys($manifest[$section] ?? []))
            ->unique()
            ->values();

        return $names
            ->map(fn (string $name) => [
                'package_manager' => 'npm',
                'package_name' => $name,
                'license' => null,
                'description' => null,
            ])
            ->all();
    }
}
