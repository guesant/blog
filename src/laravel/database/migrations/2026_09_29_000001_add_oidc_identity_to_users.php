<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'oidc_issuer')) {
            Schema::table('users', function (Blueprint $table): void {
                $table->string('oidc_issuer')->nullable();
                $table->string('oidc_subject')->nullable();
                $table->unique(['oidc_issuer', 'oidc_subject']);
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('users', 'oidc_issuer')) {
            return;
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['oidc_issuer', 'oidc_subject']);
            $table->dropColumn(['oidc_issuer', 'oidc_subject']);
        });
    }
};
