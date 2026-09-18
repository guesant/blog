using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blog.Blazor.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddFindingPopularityFeaturedAndTopicHierarchy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "featured",
                table: "resources",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "featured_order",
                table: "resources",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "popularity_kind",
                table: "resources",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "popularity_rank",
                table: "resources",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "popularity_refreshed_at",
                table: "resources",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "popularity_value",
                table: "resources",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "topics_parent_id_index",
                table: "topics",
                column: "parent_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "topics_parent_id_index",
                table: "topics");

            migrationBuilder.DropColumn(
                name: "featured",
                table: "resources");

            migrationBuilder.DropColumn(
                name: "featured_order",
                table: "resources");

            migrationBuilder.DropColumn(
                name: "popularity_kind",
                table: "resources");

            migrationBuilder.DropColumn(
                name: "popularity_rank",
                table: "resources");

            migrationBuilder.DropColumn(
                name: "popularity_refreshed_at",
                table: "resources");

            migrationBuilder.DropColumn(
                name: "popularity_value",
                table: "resources");
        }
    }
}
