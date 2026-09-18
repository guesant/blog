<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Project;
use Illuminate\Database\Seeder;

/**
 * Seeds the 'portfolio' Page row and its per-locale translation fields with
 * placeholder copy, plus up to 3 featured cases/projects, so the redesigned
 * /portfolio hub has content to render. Not called from DatabaseSeeder —
 * run manually with:
 *
 *   php artisan db:seed --class=PortfolioPageSeeder
 *
 * Safe to re-run: translation fields are merged fill-missing-only (existing
 * keys, including edits made in Filament, are never overwritten), and
 * featured pivots are only attached when the page currently has none.
 */
class PortfolioPageSeeder extends Seeder
{
    public function run(): void
    {
        $page = Page::firstOrCreate(['slug' => 'portfolio']);

        foreach ($this->translations() as $locale => $defaults) {
            $translation = $page->translations()->firstOrNew(['locale' => $locale]);
            $translation->fields = [...$defaults, ...($translation->fields ?? [])];
            $translation->save();
        }

        if ($page->featuredCases()->count() === 0) {
            CaseStudy::query()
                ->where('hidden', false)
                ->where('nda', false)
                ->orderBy('order')
                ->orderBy('id')
                ->take(3)
                ->get()
                ->each(fn (CaseStudy $case, int $index) => $page->featuredCases()->attach($case, ['order' => $index + 1]));
        }

        if ($page->featuredProjects()->count() === 0) {
            Project::query()
                ->where('hidden', false)
                ->where('nda', false)
                ->orderBy('order')
                ->orderBy('id')
                ->take(3)
                ->get()
                ->each(fn (Project $project, int $index) => $page->featuredProjects()->attach($project, ['order' => $index + 1]));
        }
    }

    private function translations(): array
    {
        return [
            'en' => [
                'heroIdentity' => 'software engineer',
                'heroExperience' => 'building products end to end, from architecture to interface.',
                'heroCurrentFocus' => 'currently focused on turning ambiguous problems into shipped software.',
                'availableLabel' => 'available for new work',
                'workEyebrow' => 'selected work',
                'workTitle' => 'cases',
                'workDescription' => 'a few projects worth a closer look.',
                'projectsEyebrow' => 'independent work',
                'projectsTitle' => 'projects',
                'projectsDescription' => 'smaller builds and experiments outside client work.',
                'experimentsSummary' => 'plus {count} experiments living at the projects page.',
            ],
            'pt-BR' => [
                'heroIdentity' => 'engenheiro de software',
                'heroExperience' => 'construindo produtos de ponta a ponta, da arquitetura à interface.',
                'heroCurrentFocus' => 'focado em transformar problemas ambíguos em software entregue.',
                'availableLabel' => 'disponível para novos projetos',
                'workEyebrow' => 'trabalhos selecionados',
                'workTitle' => 'cases',
                'workDescription' => 'alguns projetos que valem uma olhada mais de perto.',
                'projectsEyebrow' => 'trabalhos independentes',
                'projectsTitle' => 'projetos',
                'projectsDescription' => 'builds menores e experimentos fora do trabalho com clientes.',
                'experimentsSummary' => 'mais {count} experimentos na página de projetos.',
            ],
        ];
    }
}
