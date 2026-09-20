<?php

namespace App\Filament\Resources\ResourceFindings;

use App\Filament\Resources\ResourceFindings\Pages\CreateResourceFinding;
use App\Filament\Resources\ResourceFindings\Pages\EditResourceFinding;
use App\Filament\Resources\ResourceFindings\Pages\ListResourceFindings;
use App\Filament\Resources\ResourceFindings\Schemas\ResourceFindingForm;
use App\Filament\Resources\ResourceFindings\Tables\ResourceFindingsTable;
use App\Models\Resource as ResourceModel;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ResourceFindingResource extends Resource
{
    protected static ?string $model = ResourceModel::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMagnifyingGlass;

    protected static ?string $navigationLabel = 'Findings';

    protected static ?string $modelLabel = 'Finding';

    protected static ?string $slug = 'findings';

    public static function form(Schema $schema): Schema
    {
        return ResourceFindingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ResourceFindingsTable::configure($table);
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
            'index' => ListResourceFindings::route('/'),
            'create' => CreateResourceFinding::route('/create'),
            'edit' => EditResourceFinding::route('/{record}/edit'),
        ];
    }
}
