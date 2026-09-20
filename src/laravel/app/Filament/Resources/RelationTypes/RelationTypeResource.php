<?php

namespace App\Filament\Resources\RelationTypes;

use App\Filament\Resources\RelationTypes\Pages\CreateRelationType;
use App\Filament\Resources\RelationTypes\Pages\EditRelationType;
use App\Filament\Resources\RelationTypes\Pages\ListRelationTypes;
use App\Filament\Resources\RelationTypes\Schemas\RelationTypeForm;
use App\Filament\Resources\RelationTypes\Tables\RelationTypesTable;
use App\Models\RelationType;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class RelationTypeResource extends Resource
{
    protected static ?string $model = RelationType::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTag;

    public static function form(Schema $schema): Schema
    {
        return RelationTypeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RelationTypesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRelationTypes::route('/'),
            'create' => CreateRelationType::route('/create'),
            'edit' => EditRelationType::route('/{record}/edit'),
        ];
    }
}
