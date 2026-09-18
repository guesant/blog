<?php

namespace App\Console\Commands;

use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Project;
use App\Models\Writing;
use Illuminate\Console\Command;

class FixEmDashesInContent extends Command
{
    protected $signature = 'content:fix-em-dashes {--apply : Persist the changes instead of only printing a diff}';

    protected $description = 'Replace specific em dashes with punctuation in a fixed list of database prose fields';

    private const REPLACEMENTS = [
        ['Writing', 'antes-de-programar', 'en', 'body',
            'many of my early projects were like that — larger than my ability to finish them.',
            'many of my early projects were like that: larger than my ability to finish them.'],
        ['Writing', 'antes-de-programar', 'pt-BR', 'body',
            'muitos dos meus primeiros projetos eram assim — maiores do que a minha capacidade de terminá-los.',
            'muitos dos meus primeiros projetos eram assim: maiores do que a minha capacidade de terminá-los.'],
        ['Writing', 'engenharia-do-portfolio', 'en', 'excerpt',
            'deployment — including learning when to remove complexity again.',
            'deployment, including learning when to remove complexity again.'],
        ['Writing', 'engenharia-do-portfolio', 'en', 'body',
            'removals — deciding that an OCI image',
            'removals: deciding that an OCI image'],
        ['Writing', 'engenharia-do-portfolio', 'pt-BR', 'excerpt',
            'deploy — inclusive aprendendo quando remover complexidade de novo.',
            'deploy, inclusive aprendendo quando remover complexidade de novo.'],
        ['Writing', 'engenharia-do-portfolio', 'pt-BR', 'body',
            'remoções — decidir que uma imagem OCI',
            'remoções: decidir que uma imagem OCI'],
        ['Writing', 'pdf-semantico', 'en', 'body',
            'it was crude, but it worked — and that made it a useful first version.',
            'it was crude, but it worked, and that made it a useful first version.'],
        ['Writing', 'pdf-semantico', 'pt-BR', 'body',
            'era uma solução rudimentar, mas funcionava — e justamente por isso foi uma primeira versão útil.',
            'era uma solução rudimentar, mas funcionava, e justamente por isso foi uma primeira versão útil.'],
        ['Writing', 'rrule', 'en', 'body',
            'the problem — parsing and expanding a recurrence rule — but the pull request',
            'the problem (parsing and expanding a recurrence rule), but the pull request'],
        ['Writing', 'rrule', 'pt-BR', 'body',
            'do problema — interpretar e expandir uma regra de recorrência —, mas o próprio PR',
            'do problema (interpretar e expandir uma regra de recorrência), mas o próprio PR'],
        ['Writing', 'scraping-da-pagina-ao-scrap-rain', 'en', 'body',
            'the page — querySelectorAll and related primitives — to collect',
            'the page (querySelectorAll and related primitives) to collect'],
        ['Writing', 'scraping-da-pagina-ao-scrap-rain', 'pt-BR', 'body',
            'na página — querySelectorAll e primitivas parecidas — para coletar',
            'na página (querySelectorAll e primitivas parecidas) para coletar'],
        ['Page', 'achados', 'en', 'fields.description',
            'external references — books, papers, repos, videos, and more.',
            'external references: books, papers, repos, videos, and more.'],
        ['Page', 'achados', 'pt-BR', 'fields.description',
            'referências externas — livros, papers, repositórios, vídeos e mais.',
            'referências externas: livros, papers, repositórios, vídeos e mais.'],
        ['CaseStudy', 'ava-pro', 'en', 'title',
            'AVA Pro — Moodle inside a browser extension',
            'AVA Pro: Moodle inside a browser extension'],
        ['CaseStudy', 'ava-pro', 'pt-BR', 'title',
            'AVA Pro — Moodle dentro de uma extensão de navegador',
            'AVA Pro: Moodle dentro de uma extensão de navegador'],
        ['CaseStudy', 'fabricjs-object-fit', 'en', 'body',
            'stayed similar — predictable image composition on a canvas — but the implementation',
            'stayed similar (predictable image composition on a canvas), but the implementation'],
        ['CaseStudy', 'fabricjs-object-fit', 'pt-BR', 'body',
            'continuou parecido — compor imagens de forma previsível em um canvas — mas a implementação',
            'continuou parecido (compor imagens de forma previsível em um canvas), mas a implementação'],
        ['CaseStudy', 'ladesa', 'en', 'title',
            'SISGHA / Ladesa — academic management and scheduling',
            'SISGHA / Ladesa: academic management and scheduling'],
        ['CaseStudy', 'ladesa', 'en', 'body',
            'before that PDF — the academic entities',
            'before that PDF: the academic entities'],
        ['CaseStudy', 'ladesa', 'pt-BR', 'title',
            'SISGHA / Ladesa — gestão acadêmica e horários',
            'SISGHA / Ladesa: gestão acadêmica e horários'],
        ['CaseStudy', 'ladesa', 'pt-BR', 'body',
            'antes daquele PDF — as entidades acadêmicas',
            'antes daquele PDF: as entidades acadêmicas'],
        ['CaseStudy', 'scrap-rain', 'en', 'title',
            'Scrap Rain — multi-source product catalog scraping',
            'Scrap Rain: multi-source product catalog scraping'],
        ['CaseStudy', 'scrap-rain', 'pt-BR', 'title',
            'Scrap Rain — scraping de catálogos em múltiplas fontes',
            'Scrap Rain: scraping de catálogos em múltiplas fontes'],
        ['Project', 'ava-pro', 'en', 'body',
            'historical story — how the project moved my scraping experiments from static DOM extraction toward authenticated application flows — while this page',
            'historical story: how the project moved my scraping experiments from static DOM extraction toward authenticated application flows, while this page'],
        ['Project', 'ava-pro', 'pt-BR', 'body',
            'história mais útil — como o projeto levou meus experimentos de scraping da extração estática de DOM para fluxos de aplicação autenticada — enquanto esta página',
            'história mais útil: como o projeto levou meus experimentos de scraping da extração estática de DOM para fluxos de aplicação autenticada, enquanto esta página'],
    ];

    private const MODEL_CLASSES = [
        'Writing' => Writing::class,
        'CaseStudy' => CaseStudy::class,
        'Project' => Project::class,
    ];

    public function handle(): int
    {
        $apply = (bool) $this->option('apply');

        $found = 0;
        $missing = 0;

        foreach (self::REPLACEMENTS as [$model, $slug, $locale, $field, $from, $to]) {
            $label = "{$model}/{$slug}/{$locale}/{$field}";

            $translation = $this->resolveTranslation($model, $slug, $locale);
            if (! $translation) {
                $this->warn("{$label}: registro ou tradução não encontrado");
                $missing++;

                continue;
            }

            if (str_starts_with($field, 'fields.')) {
                $key = substr($field, strlen('fields.'));
                $fields = $translation->fields ?? [];
                $current = $fields[$key] ?? null;
            } else {
                $current = $translation->{$field} ?? null;
            }

            if (! is_string($current) || ! str_contains($current, $from)) {
                $this->warn("{$label}: texto de origem não encontrado");
                $missing++;

                continue;
            }

            $updated = str_replace($from, $to, $current);
            $this->printDiff($label, $current, $updated);
            $found++;

            if (! $apply) {
                continue;
            }

            if (str_starts_with($field, 'fields.')) {
                $key = substr($field, strlen('fields.'));
                $fields = $translation->fields ?? [];
                $fields[$key] = $updated;
                $translation->fields = $fields;
            } else {
                $translation->{$field} = $updated;
            }

            $translation->save();
        }

        $this->newLine();
        $this->info("{$found} encontrados, {$missing} não encontrados.");
        $this->info($apply ? 'Applied.' : 'Dry run only — rerun with --apply to persist.');

        return self::SUCCESS;
    }

    private function resolveTranslation(string $model, string $slug, string $locale)
    {
        if ($model === 'Page') {
            $page = Page::with('translations')->where('slug', $slug)->first();

            return $page?->translations->firstWhere('locale', $locale);
        }

        $class = self::MODEL_CLASSES[$model] ?? null;
        if (! $class) {
            return null;
        }

        $record = $class::with('translations')->where('slug', $slug)->first();

        return $record?->translations->firstWhere('locale', $locale);
    }

    private function printDiff(string $label, string $before, string $after): void
    {
        $this->line("--- {$label} ---");
        $this->line('BEFORE: '.$before);
        $this->line('AFTER:  '.$after);
        $this->newLine();
    }
}
