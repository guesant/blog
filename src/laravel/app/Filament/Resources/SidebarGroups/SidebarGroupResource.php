<?php

namespace App\Filament\Resources\SidebarGroups;

use App\Filament\Concerns\TranslatesResourceLabels;
use App\Filament\Resources\SidebarGroups\Pages\CreateSidebarGroup;
use App\Filament\Resources\SidebarGroups\Pages\EditSidebarGroup;
use App\Filament\Resources\SidebarGroups\Pages\ListSidebarGroups;
use App\Filament\Resources\SidebarGroups\Schemas\SidebarGroupForm;
use App\Filament\Resources\SidebarGroups\Tables\SidebarGroupsTable;
use App\Models\SidebarGroup;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Resources\ResourceConfiguration;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

/** @extends \Filament\Resources\Resource<SidebarGroup, ResourceConfiguration> */
class SidebarGroupResource extends Resource
{
    use TranslatesResourceLabels;

    protected static ?string $model = SidebarGroup::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleGroup;

    protected static ?string $navigationLabel = 'Sidebar groups';

    protected static ?string $modelLabel = 'Sidebar group';

    public static function form(Schema $schema): Schema
    {
        return SidebarGroupForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SidebarGroupsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSidebarGroups::route('/'),
            'create' => CreateSidebarGroup::route('/create'),
            'edit' => EditSidebarGroup::route('/{record}/edit'),
        ];
    }
}
