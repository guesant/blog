<?php

namespace App\Console\Commands;

use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Project;
use App\Models\ReferenceCollection;
use App\Models\Resource;
use App\Models\Topic;
use App\Models\Writing;
use Illuminate\Console\Command;

class LowercaseAuthoredContent extends Command
{
    protected $signature = 'content:lowercase-authored {--apply : Persist the changes instead of only printing a diff}';

    protected $description = 'Lowercase writing/finding prose and a few short badge labels, preserving proper nouns and acronyms';

    private const PROTECTED_TERMS = [
        'elementary OS', 'Second Life', 'Campo Minado', 'Linux Mint', 'Kali Linux',
        'AVA Pro', 'Scrap Rain', 'André Rafael', 'Ji-Paraná', 'Wi-Fi', 'PDF.js',
        'Brazil', 'Brasil',
        'Windows', 'Linux', 'macOS', 'Deepin', 'Fedora', 'Ubuntu', 'Zorin', 'Mint', 'Kali',
        'HTML', 'CSS', 'JavaScript', 'PHP', 'XAMPP', 'WAMP', 'YouTube', 'WordPress',
        'UAS', 'Origamid', 'npm', 'SoloLearn', 'IFRO', 'IFPR', 'JipaCoding', 'reCAPTCHA',
        'Vue', 'NativeScript', 'Minesweeper', 'Habbo', 'Minecraft', 'CDs', 'CD', 'USB',
        'Next.js', 'TinaCMS', 'LaTeX', 'TeX', 'PDF', 'CI', 'MVP', 'Vercel', 'Hermit',
        'Tectonic', 'OCI', 'Lighthouse', 'AI', 'IA', 'Parcel', 'pnpm',
        'SISGHA', 'Ladesa', 'SPA', 'JSON', 'Lodash', 'G1', 'Moodle', 'DOM',
        'RRule', 'RRULE', 'UTC', 'APIs', 'API', 'PR', 'POC', 'querySelectorAll', 'querySelector',
        'Raft', 'Paxos',
        'I',
        'TypeScript', 'React', 'React Query', 'MUI', 'SQLite', 'TypeORM', 'Cloudflare',
        'Kubernetes', 'K3s', '.NET', 'OpenAPI', 'GraphQL', 'NestJS', 'PostgreSQL',
        'Keycloak', 'SurveyJS', 'Meilisearch', 'GitHub', 'GitHub Pages', 'Git', 'CodeQL',
        'Nx', 'Bun', 'Zod', 'Nuxt', 'Nuxt Auth', 'PWA', 'CLI', 'FFI', 'GObject', 'GLib',
        'QuickJS', 'Swagger', 'QuickType', 'Vite', 'FFmpeg', 'CSV', 'Dockerfile',
        'PouchDB', 'SSR', 'WPF', 'XAML', 'C#', 'Ionic', 'VPS', 'VPN', 'VPNs', 'DNS', 'UI',
        'AST', 'CMS', 'Fabric.js', 'Telegram',
        'Vitor Daniel Silva Mello', 'Vitor Daniel Silva Melo', 'Anna Isabela Bianchini Pontusckha',
        'Gabriel Rodrigues Antunes', 'Gabriel Lucena Ferreira', 'Pedro Henrique de Melo Batista',
        'Rondônia', 'IF Rondônia', 'Brasília', 'TCE-RO', 'DPR-RO',
        'Alset ALOC', 'Fantastic Images', 'Friendly TNSVue', 'Ya Time Marker', 'Meu Caderno',
        'Nota Filler', 'Outro Bun', 'Unispec', 'SIPEC',
        'CRUD', 'CRUDs', 'DTO', 'DTOs', 'Secure Custom Fields',
        'Go', 'ANP', 'Lerna', 'PROINFE', 'README',
        'parcel-resolver-pnpm', 'quickjs-gobject', 'pwa-icon-generator',
    ];

    public function handle(): int
    {
        $apply = (bool) $this->option('apply');

        $this->processWritings($apply);
        $this->processResources($apply);
        $this->processCaseStudies($apply);
        $this->processProjects($apply);
        $this->processTopics($apply);
        $this->processReferenceCollections($apply);
        $this->processPages($apply);

        $this->newLine();
        $this->info($apply ? 'Applied.' : 'Dry run only — rerun with --apply to persist.');

        return self::SUCCESS;
    }

    private function processWritings(bool $apply): void
    {
        Writing::with('translations')->get()->each(function (Writing $writing) use ($apply) {
            $writing->translations->each(function ($t) use ($writing, $apply) {
                $label = "writing:{$writing->slug}:{$t->locale}";
                $this->diffField($label, 'title', $t, $apply, markdown: false);
                $this->diffField($label, 'excerpt', $t, $apply, markdown: false);
                $this->diffField($label, 'body', $t, $apply, markdown: true);
            });
        });
    }

    private function processResources(bool $apply): void
    {
        Resource::with('translations')->get()->each(function (Resource $resource) use ($apply) {
            $resource->translations->each(function ($t) use ($resource, $apply) {
                $label = "resource:{$resource->slug}:{$t->locale}";
                $this->diffField($label, 'description', $t, $apply, markdown: false);
                $this->diffField($label, 'personal_note', $t, $apply, markdown: false);
                $this->diffField($label, 'reason_found', $t, $apply, markdown: false);
            });
        });
    }

    private function processCaseStudies(bool $apply): void
    {
        CaseStudy::with('translations')->get()->each(function (CaseStudy $caseStudy) use ($apply) {
            $caseStudy->translations->each(function ($t) use ($caseStudy, $apply) {
                $label = "case-study:{$caseStudy->slug}:{$t->locale}";
                $this->diffField($label, 'title', $t, $apply, markdown: false);
                $this->diffField($label, 'status', $t, $apply, markdown: false);
                $this->diffField($label, 'meta', $t, $apply, markdown: false);
                $this->diffField($label, 'summary', $t, $apply, markdown: false);
                $this->diffField($label, 'context', $t, $apply, markdown: false);
                $this->diffField($label, 'role', $t, $apply, markdown: false);
                $this->diffField($label, 'result', $t, $apply, markdown: false);
                $this->diffField($label, 'body', $t, $apply, markdown: true);
            });
        });
    }

    private function processProjects(bool $apply): void
    {
        Project::with('translations')->get()->each(function (Project $project) use ($apply) {
            $project->translations->each(function ($t) use ($project, $apply) {
                $label = "project:{$project->slug}:{$t->locale}";
                $this->diffField($label, 'name', $t, $apply, markdown: false);
                $this->diffField($label, 'purpose', $t, $apply, markdown: false);
                $this->diffField($label, 'problem', $t, $apply, markdown: false);
                $this->diffField($label, 'current_focus', $t, $apply, markdown: false);
                $this->diffField($label, 'status', $t, $apply, markdown: false);
                $this->diffField($label, 'body', $t, $apply, markdown: true);
            });
        });
    }

    private function processTopics(bool $apply): void
    {
        Topic::with('translations')->get()->each(function (Topic $topic) use ($apply) {
            $topic->translations->each(function ($t) use ($topic, $apply) {
                $label = "topic:{$topic->slug}:{$t->locale}";
                $this->diffField($label, 'name', $t, $apply, markdown: false);
            });
        });
    }

    private function processReferenceCollections(bool $apply): void
    {
        ReferenceCollection::with('translations')->get()->each(function (ReferenceCollection $collection) use ($apply) {
            $collection->translations->each(function ($t) use ($collection, $apply) {
                $label = "reference-collection:{$collection->slug}:{$t->locale}";
                $this->diffField($label, 'title', $t, $apply, markdown: false);
                $this->diffField($label, 'description', $t, $apply, markdown: false);
                $this->diffField($label, 'intro', $t, $apply, markdown: true);
            });
        });
    }

    private function processPages(bool $apply): void
    {
        $targets = [
            'boot' => ['badge_line'],
            'portfolio' => ['heroIdentity'],
            'about' => ['eyebrow', 'title', 'storyEyebrow', 'storyTitle', 'lead', 'context', 'description', 'story'],
            'achados' => ['eyebrow', 'title'],
            'cases' => ['eyebrow', 'title'],
            'contact' => ['eyebrow', 'title'],
            'credits' => ['title'],
            'projects' => ['eyebrow', 'title', 'selectedLabel', 'archiveLabel', 'experimentsTitle'],
            'resume' => ['title'],
            'writing' => ['eyebrow', 'title'],
            'brutal-1997' => ['construction_badge'],
        ];

        foreach ($targets as $slug => $keys) {
            $page = Page::with('translations')->where('slug', $slug)->first();
            if (! $page) {
                continue;
            }

            foreach ($page->translations as $t) {
                $fields = $t->fields ?? [];
                $changed = false;

                foreach ($keys as $key) {
                    if (! array_key_exists($key, $fields) || ! is_string($fields[$key])) {
                        continue;
                    }

                    $original = $fields[$key];
                    $normalized = $this->lowercaseProtected($original);
                    if ($normalized === $original) {
                        continue;
                    }

                    $this->printDiff("page:{$slug}:{$t->locale}", $key, $original, $normalized);
                    $fields[$key] = $normalized;
                    $changed = true;
                }

                if ($changed && $apply) {
                    $t->fields = $fields;
                    $t->save();
                }
            }
        }
    }

    private function diffField(string $label, string $field, $translation, bool $apply, bool $markdown): void
    {
        $original = $translation->{$field};
        if (! is_string($original) || trim($original) === '') {
            return;
        }

        $normalized = $markdown ? $this->normalizeMarkdown($original) : $this->lowercaseProtected($original);
        if ($normalized === $original) {
            return;
        }

        $this->printDiff($label, $field, $original, $normalized);

        if ($apply) {
            $translation->{$field} = $normalized;
            $translation->save();
        }
    }

    private function printDiff(string $label, string $field, string $before, string $after): void
    {
        $this->line("--- {$label} :: {$field} ---");
        $this->line('BEFORE: '.$before);
        $this->line('AFTER:  '.$after);
        $this->newLine();
    }

    private function normalizeMarkdown(string $text): string
    {
        $placeholders = [];
        $index = 0;

        $protect = function (string $chunk) use (&$placeholders, &$index): string {
            $token = "\x00{$index}\x00";
            $placeholders[$token] = $chunk;
            $index++;

            return $token;
        };

        $text = preg_replace_callback('/```.*?```/s', fn ($m) => $protect($m[0]), $text);
        $text = preg_replace_callback('/`[^`]*`/', fn ($m) => $protect($m[0]), $text);
        $text = preg_replace_callback('/\]\(([^)]*)\)/', fn ($m) => ']('.$protect($m[1]).')', $text);

        $text = $this->lowercaseProtected($text);

        foreach ($placeholders as $token => $chunk) {
            $text = str_replace($token, $chunk, $text);
        }

        return $text;
    }

    private function lowercaseProtected(string $text): string
    {
        $terms = self::PROTECTED_TERMS;
        usort($terms, fn ($a, $b) => mb_strlen($b) <=> mb_strlen($a));

        $groups = [];
        foreach ($terms as $term) {
            $groups[mb_strtolower($term, 'UTF-8')][] = $term;
        }

        $alternation = implode('|', array_map(fn ($term) => preg_quote($term, '/'), $terms));
        $pattern = '/(?<![\p{L}\p{N}])(?:'.$alternation.')(?![\p{L}\p{N}])/ui';

        if (! preg_match_all($pattern, $text, $matches, PREG_OFFSET_CAPTURE)) {
            return mb_strtolower($text, 'UTF-8');
        }

        $result = '';
        $cursor = 0;

        foreach ($matches[0] as [$matchText, $byteOffset]) {
            $result .= mb_strtolower(substr($text, $cursor, $byteOffset - $cursor), 'UTF-8');

            $candidates = $groups[mb_strtolower($matchText, 'UTF-8')] ?? [$matchText];
            $result .= count($candidates) === 1 ? $candidates[0] : $matchText;

            $cursor = $byteOffset + strlen($matchText);
        }

        $result .= mb_strtolower(substr($text, $cursor), 'UTF-8');

        return $result;
    }
}
