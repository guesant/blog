<?php

namespace App\Filament\Resources\NavItems\Pages;

use App\Content\SidebarGroupOrderSynchronizer;
use App\Filament\Resources\NavItems\NavItemResource;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ListNavItems extends ListRecords
{
    protected static string $resource = NavItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
            Action::make('reorderSidebarGroups')
                ->label('Edit sidebar groups')
                ->icon('heroicon-o-bars-3-bottom-left')
                ->modalHeading('Edit sidebar groups')
                ->modalDescription('Reorder groups with drag and drop or the arrow buttons.')
                ->modalWidth('2xl')
                ->fillForm(fn (): array => ['groups' => $this->sidebarGroupFormData()])
                ->form([
                    Repeater::make('groups')
                        ->label('Sidebar groups')
                        ->schema([
                            Hidden::make('key'),
                            Hidden::make('label'),
                            Hidden::make('items'),
                        ])
                        ->itemLabel(fn (mixed $state): ?string => is_array($state) ? ($state['label'] ?? null) : null)
                        ->reorderable()
                        ->reorderableWithButtons()
                        ->addable(false)
                        ->deletable(false)
                        ->defaultItems(0),
                ])
                ->action(function (array $data): void {
                    app(SidebarGroupOrderSynchronizer::class)->synchronize(
                        collect($data['groups'] ?? [])->pluck('key')->all(),
                    );

                    Notification::make()
                        ->title('Sidebar groups reordered')
                        ->success()
                        ->send();
                }),
        ];
    }

    private function sidebarGroupFormData(): array
    {
        return DB::table('nav_items')
            ->where('placement', 'sidebar')
            ->whereNull('parent_id')
            ->whereNotNull('sidebar_group')
            ->orderBy('sidebar_group')
            ->orderBy('order')
            ->get(['route_name', 'sidebar_group'])
            ->groupBy('sidebar_group')
            ->values()
            ->map(function (Collection $items, int $position): array {
                return [
                    'key' => (string) $items->first()->sidebar_group,
                    'label' => 'Group '.($position + 1),
                    'items' => $items->pluck('route_name')->values()->all(),
                ];
            })
            ->all();
    }
}
