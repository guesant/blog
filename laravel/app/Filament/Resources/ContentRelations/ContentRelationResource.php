<?php

namespace App\Filament\Resources\ContentRelations;

use App\Filament\Resources\ContentRelations\Pages\CreateContentRelation;
use App\Filament\Resources\ContentRelations\Pages\EditContentRelation;
use App\Filament\Resources\ContentRelations\Pages\ListContentRelations;
use App\Filament\Resources\ContentRelations\Schemas\ContentRelationForm;
use App\Filament\Resources\ContentRelations\Tables\ContentRelationsTable;
use App\Models\ContentRelation;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ContentRelationResource extends Resource
{
    protected static ?string $model = ContentRelation::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedArrowsRightLeft;

    public static function form(Schema $schema): Schema
    {
        return ContentRelationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ContentRelationsTable::configure($table);
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
            'index' => ListContentRelations::route('/'),
            'create' => CreateContentRelation::route('/create'),
            'edit' => EditContentRelation::route('/{record}/edit'),
        ];
    }
}
