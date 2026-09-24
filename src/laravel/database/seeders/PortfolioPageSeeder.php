<?php

namespace Database\Seeders;

use App\Content\EditorialRevisionPublisher;
use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Project;
use Illuminate\Database\Seeder;

class PortfolioPageSeeder extends Seeder
{
    public function run(): void
    {
        $page = Page::firstOrCreate(['slug' => 'portfolio']);
        $translations = [];

        foreach ($this->translations() as $locale => $defaults) {
            $current = $page->translation($locale)?->fields ?? [];
            $translations[$locale] = [...$defaults, ...$current];
        }

        app(EditorialRevisionPublisher::class)->publish($page, $translations);

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

        app(EditorialRevisionPublisher::class)->syncPageRelations($page->fresh());
    }

    private function translations(): array
    {
        return [
            'en' => [
                'heroIdentity' => 'software engineer',
                'heroExperience' => 'building products end to end, from architecture to interface.',
                'heroCurrentFocus' => 'currently focused on turning ambiguous problems into shipped software.',
                'availableLabel' => 'Available for Opportunities',
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
                'availableLabel' => 'Disponível para Oportunidades',
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
