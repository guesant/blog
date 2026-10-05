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
                'title' => 'Portfolio',
                'description' => 'A curated view of selected work and independent projects.',
                'heroIdentity' => 'Software Engineer',
                'heroExperience' => 'Building products end to end, from architecture to interface.',
                'heroCurrentFocus' => 'Currently focused on turning ambiguous problems into shipped software.',
                'availableLabel' => 'Available for Opportunities',
                'workEyebrow' => 'Selected Work',
                'workTitle' => 'Cases',
                'workDescription' => 'A few projects worth a closer look.',
                'projectsEyebrow' => 'Independent Work',
                'projectsTitle' => 'Projects',
                'projectsDescription' => 'Smaller builds and experiments outside client work.',
                'experimentsSummary' => 'Plus {count} experiments living at the projects page.',
            ],
            'pt-BR' => [
                'title' => 'Portfólio',
                'description' => 'Uma visão curada de trabalhos selecionados e projetos independentes.',
                'heroIdentity' => 'Engenheiro de Software',
                'heroExperience' => 'Construindo produtos de ponta a ponta, da arquitetura à interface.',
                'heroCurrentFocus' => 'Focado em transformar problemas ambíguos em software entregue.',
                'availableLabel' => 'Disponível para Oportunidades',
                'workEyebrow' => 'Trabalhos Selecionados',
                'workTitle' => 'Cases',
                'workDescription' => 'Alguns projetos que valem uma olhada mais de perto.',
                'projectsEyebrow' => 'Trabalhos Independentes',
                'projectsTitle' => 'Projetos',
                'projectsDescription' => 'Builds menores e experimentos fora do trabalho com clientes.',
                'experimentsSummary' => 'Mais {count} experimentos na página de projetos.',
            ],
        ];
    }
}
