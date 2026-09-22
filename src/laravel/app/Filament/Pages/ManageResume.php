<?php

namespace App\Filament\Pages;

use App\Content\EditorialRevisionPublisher;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\SyncsTranslations;
use App\Jobs\GenerateResumePdf as GenerateResumePdfJob;
use App\Models\CaseStudy;
use App\Models\Resume;
use App\Models\ResumeSkill;
use App\Models\Technology;
use App\Models\Topic;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * @property-read Schema $form
 */
class ManageResume extends Page
{
    use BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, SyncsTranslations;

    protected static function entryRepeater(string $name, string $label, array $fields, string $labelKey): Repeater
    {
        return Repeater::make($name)
            ->label($label)
            ->columns(2)
            ->collapsed()
            ->schema($fields)
            ->itemLabel(fn (array $state): ?string => $state[$labelKey] ?? null)
            ->formatStateUsing(fn ($state) => $state ?? [])
            ->addActionLabel('Add entry')
            ->defaultItems(0);
    }

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected string $view = 'filament-panels::pages.page';

    public ?array $data = [];

    protected ?Resume $record = null;

    protected array $pendingSelectedCases = [];

    protected array $pendingSkills = [];

    public function mount(): void
    {
        $this->record = Resume::query()->first() ?? Resume::create();

        $data = [];
        $data = $this->fillTranslationsIntoData($data);

        $data['selected_cases'] = $this->record->selectedCases()
            ->get()
            ->map(fn ($case) => ['case_study_id' => $case->id, 'order' => $case->pivot->order])
            ->all();

        $data['skills'] = $this->record->skills()
            ->with('technologies')
            ->get()
            ->map(fn (ResumeSkill $skill) => [
                'topic_id' => $skill->topic_id,
                'order' => $skill->order,
                'technologies' => $skill->technologies->pluck('id')->all(),
            ])
            ->all();

        $this->form->fill($data);
    }

    protected function getRecord(): Resume
    {
        return $this->record ??= Resume::query()->first() ?? Resume::create();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('regeneratePdfs')
                ->label('Regenerate PDFs')
                ->action(function () {
                    foreach (['en', 'pt-BR'] as $locale) {
                        GenerateResumePdfJob::dispatchSync($locale);
                    }

                    Notification::make()->success()->title('Résumé PDFs regenerated')->send();
                }),
        ];
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Selected Cases')
                    ->schema([
                        Repeater::make('selected_cases')
                            ->columns(2)
                            ->schema([
                                Select::make('case_study_id')
                                    ->label('Case Study')
                                    ->options(fn () => CaseStudy::query()->pluck('slug', 'id'))
                                    ->searchable()
                                    ->required(),
                                TextInput::make('order')->numeric()->nullable(),
                            ])
                            ->itemLabel(fn (array $state): ?string => isset($state['case_study_id'])
                                ? CaseStudy::find($state['case_study_id'])?->slug
                                : null)
                            ->addActionLabel('Add case')
                            ->defaultItems(0),
                    ]),
                Section::make('Skills')
                    ->schema([
                        Repeater::make('skills')
                            ->columns(2)
                            ->schema([
                                Select::make('topic_id')
                                    ->label('Topic')
                                    ->options(fn () => Topic::query()->where('kind', 'skill')->pluck('slug', 'id'))
                                    ->searchable()
                                    ->required(),
                                TextInput::make('order')->numeric()->nullable(),
                                Select::make('technologies')
                                    ->label('Technologies')
                                    ->options(fn () => Technology::query()->pluck('slug', 'id'))
                                    ->multiple()
                                    ->searchable()
                                    ->preload()
                                    ->columnSpanFull(),
                            ])
                            ->itemLabel(fn (array $state): ?string => isset($state['topic_id'])
                                ? Topic::find($state['topic_id'])?->slug
                                : null)
                            ->addActionLabel('Add skill category')
                            ->defaultItems(0),
                    ]),
                Section::make('Languages')
                    ->schema([
                        Repeater::make('languages')
                            ->relationship('languages')
                            ->columns(2)
                            ->schema([
                                Select::make('language_id')
                                    ->label('Language')
                                    ->relationship('language', 'slug')
                                    ->required(),
                                TextInput::make('proficiency')->nullable(),
                                TextInput::make('order')->numeric()->nullable(),
                            ])
                            ->itemLabel(fn (array $state): ?string => $state['proficiency'] ?? null)
                            ->addActionLabel('Add language')
                            ->defaultItems(0),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    Textarea::make("{$prefix}summary")
                        ->label('Summary')
                        ->nullable(),
                    static::entryRepeater("{$prefix}leadership", 'Leadership', [
                        TextInput::make('organization')->required(),
                        TextInput::make('period')->required(),
                        TextInput::make('role')->required()->columnSpanFull(),
                        static::stringListRepeater('highlights', 'Highlights', 'Add highlight')->columnSpanFull(),
                        Toggle::make('hidden')->inline(false),
                    ], 'organization'),
                    static::entryRepeater("{$prefix}education", 'Education', [
                        TextInput::make('institution')->required(),
                        TextInput::make('period')->required(),
                        TextInput::make('degree')->required(),
                        TextInput::make('location')->nullable(),
                        Toggle::make('hidden')->inline(false),
                    ], 'institution'),
                    static::entryRepeater("{$prefix}certificates", 'Certificates', [
                        TextInput::make('name')->required(),
                        TextInput::make('period')->required(),
                        TextInput::make('issuer')->nullable(),
                        TextInput::make('credentialId')->label('Credential ID')->nullable(),
                        TextInput::make('url')->url()->nullable()->columnSpanFull(),
                        Toggle::make('hidden')->inline(false),
                    ], 'name'),
                    static::entryRepeater("{$prefix}certifications", 'Certifications', [
                        TextInput::make('name')->required(),
                        TextInput::make('period')->required(),
                        TextInput::make('issuer')->nullable(),
                        TextInput::make('credentialId')->label('Credential ID')->nullable(),
                        TextInput::make('url')->url()->nullable()->columnSpanFull(),
                        Toggle::make('hidden')->inline(false),
                    ], 'name'),
                    static::entryRepeater("{$prefix}publications", 'Publications', [
                        TextInput::make('name')->required(),
                        TextInput::make('period')->required(),
                        TextInput::make('issuer')->nullable(),
                        TextInput::make('url')->url()->nullable(),
                        Toggle::make('hidden')->inline(false),
                    ], 'name'),
                    static::entryRepeater("{$prefix}recommendations", 'Recommendations', [
                        TextInput::make('author')->required(),
                        TextInput::make('period')->nullable(),
                        TextInput::make('role')->nullable()->columnSpanFull(),
                        Textarea::make('quote')->rows(3)->required()->columnSpanFull(),
                        TextInput::make('url')->url()->nullable(),
                        Toggle::make('hidden')->inline(false),
                    ], 'author'),
                    static::entryRepeater("{$prefix}technical_productions", 'Technical Productions', [
                        TextInput::make('name')->required(),
                        TextInput::make('period')->required(),
                        TextInput::make('kind')->nullable(),
                        TextInput::make('url')->url()->nullable(),
                        Textarea::make('description')->rows(2)->nullable()->columnSpanFull(),
                        Toggle::make('includeInPdf')->label('Include in PDF')->inline(false),
                        Toggle::make('hidden')->inline(false),
                    ], 'name'),
                    static::entryRepeater("{$prefix}events", 'Events', [
                        TextInput::make('name')->required(),
                        TextInput::make('period')->required(),
                        TextInput::make('role')->nullable(),
                        TextInput::make('talkTitle')->label('Talk title')->nullable(),
                        TextInput::make('location')->nullable(),
                        TextInput::make('url')->url()->nullable(),
                        Toggle::make('includeInPdf')->label('Include in PDF')->inline(false),
                        Toggle::make('hidden')->inline(false),
                    ], 'name'),
                    static::entryRepeater("{$prefix}awards", 'Awards', [
                        TextInput::make('name')->required(),
                        TextInput::make('period')->required(),
                        TextInput::make('issuer')->nullable(),
                        TextInput::make('url')->url()->nullable(),
                        Textarea::make('description')->rows(2)->nullable()->columnSpanFull(),
                        Toggle::make('hidden')->inline(false),
                    ], 'name'),
                ]),
            ])
            ->model($this->getRecord())
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $this->pendingSelectedCases = $data['selected_cases'] ?? [];
        $this->pendingSkills = $data['skills'] ?? [];
        unset($data['selected_cases'], $data['skills'], $data['languages']);

        $data = $this->extractTranslationsBeforeSave($data);

        $this->getRecord()->update($data);
        $this->persistTranslations();

        $this->getRecord()->selectedCases()->sync(
            collect($this->pendingSelectedCases)->mapWithKeys(fn (array $item) => [
                $item['case_study_id'] => ['order' => $item['order'] ?? null],
            ])
        );

        $this->getRecord()->skills()->delete();
        foreach ($this->pendingSkills as $item) {
            $skill = $this->getRecord()->skills()->create([
                'topic_id' => $item['topic_id'],
                'order' => $item['order'] ?? null,
            ]);
            $skill->technologies()->sync($item['technologies'] ?? []);
        }

        app(EditorialRevisionPublisher::class)->syncResumeRelations($this->getRecord());

        Notification::make()->success()->title('Saved')->send();
    }
}
