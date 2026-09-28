<?php

namespace App\Filament\Resources\CreditCategories;

use App\Filament\Resources\CreditCategories\Pages\CreateCreditCategory;
use App\Filament\Resources\CreditCategories\Pages\EditCreditCategory;
use App\Filament\Resources\CreditCategories\Pages\ListCreditCategories;
use App\Filament\Resources\CreditCategories\Schemas\CreditCategoryForm;
use App\Filament\Resources\CreditCategories\Tables\CreditCategoriesTable;
use App\Models\CreditCategory;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CreditCategoryResource extends Resource
{
    protected static ?string $model = CreditCategory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTag;

    protected static ?string $navigationLabel = 'Credit categories';

    protected static ?string $modelLabel = 'Credit category';

    public static function form(Schema $schema): Schema
    {
        return CreditCategoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CreditCategoriesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCreditCategories::route('/'),
            'create' => CreateCreditCategory::route('/create'),
            'edit' => EditCreditCategory::route('/{record}/edit'),
        ];
    }
}
